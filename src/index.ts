import express from 'express';
import fs from 'fs';
const csv = require('csv-parser');
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import path from 'path';
import { Transaction, Income, Expense, Category, Budget } from './models';

const app = express();
app.use(express.json());
app.use(express.static('public'));

const transactions: Transaction[] = [];
const categories: Category[] = [];
const budgets: Budget[] = [];

const loadData = async () => {
    if (fs.existsSync('transactions.csv')) {
        await new Promise<void>((resolve) => {
            const data: any[] = [];
            fs.createReadStream('transactions.csv')
                .pipe(csv())
                .on('data', (row: any) => data.push(row))
                .on('end', () => {
                    data.forEach(row => {
                        const t = row.type === 'income'
                            ? new Income(row.id, parseFloat(row.amount), new Date(row.date), row.category, row.description, row.recurring === 'true')
                            : new Expense(row.id, parseFloat(row.amount), new Date(row.date), row.category, row.description, row.recurring === 'true');
                        transactions.push(t);
                    });
                    resolve();
                });
        });
    }
    if (fs.existsSync('categories.csv')) {
        await new Promise<void>((resolve) => {
            const data: any[] = [];
            fs.createReadStream('categories.csv')
                .pipe(csv())
                .on('data', (row: any) => data.push(row))
                .on('end', () => {
                    data.forEach(row => categories.push(new Category(row.id, row.name)));
                    resolve();
                });
        });
    }
    if (fs.existsSync('budgets.csv')) {
        await new Promise<void>((resolve) => {
            const data: any[] = [];
            fs.createReadStream('budgets.csv')
                .pipe(csv())
                .on('data', (row: any) => data.push(row))
                .on('end', () => {
                    data.forEach(row => budgets.push(new Budget(row.id, row.category, parseFloat(row.limit), row.period)));
                    resolve();
                });
        });
    }
    // Add sample data if empty
    if (transactions.length === 0) {
        transactions.push(new Expense('1', 100, new Date(), 'Food', 'Lunch', false));
        transactions.push(new Expense('2', 50, new Date(), 'Transport', 'Bus', false));
        saveTransactions();
    }
    if (categories.length === 0) {
        categories.push(new Category('1', 'Food'));
        categories.push(new Category('2', 'Transport'));
        saveCategories();
    }
};

const saveTransactions = () => {
    const csvWriter = createCsvWriter({
        path: 'transactions.csv',
        header: [
            { id: 'id', title: 'id' },
            { id: 'type', title: 'type' },
            { id: 'amount', title: 'amount' },
            { id: 'date', title: 'date' },
            { id: 'category', title: 'category' },
            { id: 'description', title: 'description' },
            { id: 'recurring', title: 'recurring' }
        ]
    });
    const records = transactions.map(t => ({
        id: t.id,
        type: t instanceof Income ? 'income' : 'expense',
        amount: t.amount,
        date: t.date.toISOString(),
        category: t.category,
        description: t.description,
        recurring: t.recurring
    }));
    csvWriter.writeRecords(records);
};

const saveCategories = () => {
    const csvWriter = createCsvWriter({
        path: 'categories.csv',
        header: [
            { id: 'id', title: 'id' },
            { id: 'name', title: 'name' }
        ]
    });
    csvWriter.writeRecords(categories);
};

const saveBudgets = () => {
    const csvWriter = createCsvWriter({
        path: 'budgets.csv',
        header: [
            { id: 'id', title: 'id' },
            { id: 'category', title: 'category' },
            { id: 'limit', title: 'limit' },
            { id: 'period', title: 'period' }
        ]
    });
    csvWriter.writeRecords(budgets);
};

app.post('/transactions', (req, res) => {
    console.log('POST /transactions', req.body);
    const { type, amount, date, category, description, recurring } = req.body;
    const id = Date.now().toString();
    const t = type === 'income'
        ? new Income(id, amount, new Date(date), category, description, recurring)
        : new Expense(id, amount, new Date(date), category, description, recurring);
    transactions.push(t);
    saveTransactions();
    res.status(201).json(t);
});

app.get('/transactions', (req, res) => {
    res.json(transactions);
});

app.post('/categories', (req, res) => {
    console.log('POST /categories', req.body);
    const { name } = req.body;
    const id = Date.now().toString();
    const c = new Category(id, name);
    categories.push(c);
    saveCategories();
    res.status(201).json(c);
});

app.get('/categories', (req, res) => {
    res.json(categories);
});

app.post('/budgets', (req, res) => {
    console.log('POST /budgets', req.body);
    const { category, limit, period } = req.body;
    const id = Date.now().toString();
    const b = new Budget(id, category, limit, period);
    budgets.push(b);
    saveBudgets();
    res.status(201).json(b);
});

app.get('/budgets', (req, res) => {
    res.json(budgets);
});

app.get('/reports/monthly', (req, res) => {
  console.log('GET /reports/monthly');
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const monthly = transactions.filter(t => t.date.getMonth() === month && t.date.getFullYear() === year);
  console.log('Monthly transactions', monthly.length);
  const income = monthly.filter(t => t instanceof Income).reduce((sum, t) => sum + t.amount, 0);
  const expenses = monthly.filter(t => t instanceof Expense).reduce((sum, t) => sum + t.amount, 0);
  const byCategory = monthly.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);
  console.log('By category', byCategory);
  res.json({ income, expenses, byCategory });
});app.get('/reports/csv', (req, res) => {
    const csv = 'id,amount,date,category,description\n' + transactions.map(t => `${t.id},${t.amount},${t.date.toISOString()},${t.category},${t.description}`).join('\n');
    res.header('Content-Type', 'text/csv');
    res.send(csv);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

loadData().then(() => {
    app.listen(3000, () => console.log('Server running on port 3000'));
});