import express from 'express';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { Transaction, Income, Expense, Category, Budget } from './models';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const initDB = async () => {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      type TEXT,
      amount REAL,
      date TEXT,
      category TEXT,
      description TEXT,
      recurring INTEGER
    )
  `);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT
    )
  `);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      category TEXT,
      limit_amount REAL,
      period TEXT
    )
  `);

  // Check if categories exist, if not add defaults
  const catResult = await client.execute('SELECT count(*) as count FROM categories');
  if (Number(catResult.rows[0].count) === 0) {
    await client.execute("INSERT INTO categories (id, name) VALUES ('1', 'Food')");
    await client.execute("INSERT INTO categories (id, name) VALUES ('2', 'Transport')");
  }
};

app.post('/transactions', async (req, res) => {
  console.log('POST /transactions', req.body);
  const { type, amount, date, category, description, recurring } = req.body;
  const id = Date.now().toString();
  
  try {
    await client.execute({
      sql: 'INSERT INTO transactions (id, type, amount, date, category, description, recurring) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [id, type, amount, date, category, description, recurring ? 1 : 0]
    });
    
    const t = type === 'income'
      ? new Income(id, amount, new Date(date), category, description, recurring)
      : new Expense(id, amount, new Date(date), category, description, recurring);
      
    res.status(201).json(t);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save transaction' });
  }
});

app.get('/transactions', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM transactions');
    const transactions = result.rows.map(row => {
      const isIncome = row.type === 'income';
      const recurring = row.recurring === 1;
      return isIncome
        ? new Income(row.id as string, row.amount as number, new Date(row.date as string), row.category as string, row.description as string, recurring)
        : new Expense(row.id as string, row.amount as number, new Date(row.date as string), row.category as string, row.description as string, recurring);
    });
    res.json(transactions);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.post('/categories', async (req, res) => {
  console.log('POST /categories', req.body);
  const { name } = req.body;
  const id = Date.now().toString();
  
  try {
    await client.execute({
      sql: 'INSERT INTO categories (id, name) VALUES (?, ?)',
      args: [id, name]
    });
    const c = new Category(id, name);
    res.status(201).json(c);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save category' });
  }
});

app.get('/categories', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM categories');
    const categories = result.rows.map(row => new Category(row.id as string, row.name as string));
    res.json(categories);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/budgets', async (req, res) => {
  console.log('POST /budgets', req.body);
  const { category, limit, period } = req.body;
  
  try {
    // Check for existing budget
    const existing = await client.execute({
      sql: 'SELECT * FROM budgets WHERE category = ? AND period = ?',
      args: [category, period]
    });

    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'Budget already exists for this category and period' });
      return;
    }

    const id = Date.now().toString();
    await client.execute({
      sql: 'INSERT INTO budgets (id, category, limit_amount, period) VALUES (?, ?, ?, ?)',
      args: [id, category, limit, period]
    });
    const b = new Budget(id, category, limit, period);
    res.status(201).json(b);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save budget' });
  }
});

app.get('/budgets', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM budgets');
    const budgets = result.rows.map(row => new Budget(row.id as string, row.category as string, row.limit_amount as number, row.period as string));
    res.json(budgets);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

app.get('/reports/monthly', async (req, res) => {
  console.log('GET /reports/monthly');
  try {
    const result = await client.execute('SELECT * FROM transactions');
    const transactions = result.rows.map(row => ({
      id: row.id as string,
      type: row.type as string,
      amount: row.amount as number,
      date: new Date(row.date as string),
      category: row.category as string,
      description: row.description as string,
      recurring: row.recurring === 1
    }));

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const monthly = transactions.filter(t => t.date.getMonth() === month && t.date.getFullYear() === year);
    
    console.log('Monthly transactions', monthly.length);
    
    const income = monthly.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthly.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    const byCategory = monthly.reduce((acc, t) => {
      const cat = t.category;
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('By category', byCategory);
    res.json({ income, expenses, byCategory });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

app.get('/reports/csv', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM transactions');
    const csv = 'id,amount,date,category,description\n' + result.rows.map(row => 
      `${row.id},${row.amount},${row.date},${row.category},${row.description}`
    ).join('\n');
    res.header('Content-Type', 'text/csv');
    res.send(csv);
  } catch (e) {
    console.error(e);
    res.status(500).send('Failed to generate CSV');
  }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

initDB().then(() => {
    app.listen(3000, () => console.log('Server running on port 3000'));
});