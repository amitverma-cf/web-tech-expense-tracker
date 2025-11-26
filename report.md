# ExpenseTrack Pro - Detailed Project Report

## Web Technologies Lab Project

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [System Requirements](#3-system-requirements)
4. [Technology Stack](#4-technology-stack)
5. [System Architecture](#5-system-architecture)
6. [Database Design](#6-database-design)
7. [Backend Implementation](#7-backend-implementation)
8. [Frontend Implementation](#8-frontend-implementation)
9. [API Documentation](#9-api-documentation)
10. [Code Explanations](#10-code-explanations)
11. [Features Demonstration](#11-features-demonstration)
12. [Installation & Setup](#12-installation--setup)
13. [Future Enhancements](#13-future-enhancements)
14. [Viva Questions & Answers](#14-viva-questions--answers)
15. [Conclusion](#15-conclusion)

---

## 1. Project Overview

**ExpenseTrack Pro** is a comprehensive personal finance management web application designed to help users track their income and expenses, set budgets for different categories, and generate insightful reports for better financial decision-making.

### Key Objectives
- Provide an intuitive interface for managing personal finances
- Enable real-time tracking of income and expenses
- Implement category-based budget management with alerts
- Generate visual analytics and reports
- Ensure mobile responsiveness for on-the-go access

---

## 2. Problem Statement

### The Challenge
Managing personal finances without proper tools often leads to:
- Overspending without awareness
- Lack of visibility into spending patterns
- Difficulty in maintaining budgets
- No historical data for financial planning

### Our Solution
ExpenseTrack Pro addresses these issues by providing:
- Real-time transaction tracking
- Visual spending analytics with charts
- Budget limits with automatic alerts when exceeded
- Category-wise expense organization
- CSV export for detailed analysis

---

## 3. System Requirements

### Software Requirements
| Component | Requirement |
|-----------|-------------|
| Node.js | v18.0.0 or higher |
| npm/pnpm | Latest version |
| Browser | Chrome, Firefox, Safari, Edge (Modern versions) |
| TypeScript | v5.3.0 |

### Hardware Requirements
| Component | Minimum |
|-----------|---------|
| RAM | 4 GB |
| Storage | 500 MB |
| Processor | Dual Core |
| Network | Internet connection (for Turso DB) |

---

## 4. Technology Stack

### Backend Technologies

#### Node.js
Node.js is a JavaScript runtime built on Chrome's V8 engine. We use it to run our Express server.

```javascript
// Server initialization
const app = express();
app.listen(3000, () => console.log('Server running on port 3000'));
```

#### Express.js
A minimal and flexible Node.js web application framework providing robust features for web and mobile applications.

```javascript
// Middleware configuration
app.use(express.json());
app.use(express.static('public'));
```

#### TypeScript
TypeScript adds static typing to JavaScript, enabling better tooling and catch errors at compile time.

```typescript
// Type-safe class definition
export class Transaction implements ITransaction {
  id: string;
  type: string;
  amount: number;
  date: Date;
  category: string;
  description: string;
  recurring: boolean;
}
```

#### Turso Database (LibSQL)
Turso is an edge-hosted, distributed database built on libSQL (SQLite fork). It provides:
- Global data replication
- Low latency reads
- SQLite compatibility
- Serverless pricing

```typescript
// Database client initialization
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});
```

### Frontend Technologies

#### Tailwind CSS
A utility-first CSS framework for rapidly building custom user interfaces.

```html
<!-- Custom theme configuration -->
<script>
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: { 500: '#BA875C' },
          secondary: { 500: '#596B5F' },
          gray: { 900: '#1D1D1D' }
        }
      }
    }
  }
</script>
```

#### Chart.js
Simple yet flexible JavaScript charting library for data visualization.

```javascript
// Doughnut chart for spending analytics
chart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: labels,
    datasets: [{
      data: values,
      backgroundColor: colors
    }]
  }
});
```

#### Flowbite
Open-source UI component library built on top of Tailwind CSS.

#### Animate.css
Cross-browser CSS animations library for smooth UI transitions.

---

## 5. System Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  HTML5 + Tailwind CSS + Chart.js + Vanilla JS       │    │
│  │  • Dashboard with analytics                          │    │
│  │  • Transaction management forms                      │    │
│  │  • Budget tracking with progress bars               │    │
│  │  • Responsive design (Desktop + Mobile)             │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Node.js + Express.js + TypeScript                   │    │
│  │  • REST API endpoints                                │    │
│  │  • Business logic processing                         │    │
│  │  • Data validation                                   │    │
│  │  • CSV generation                                    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Turso Database (LibSQL/SQLite)                      │    │
│  │  • transactions table                                │    │
│  │  • categories table                                  │    │
│  │  • budgets table                                     │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow
1. User interacts with the frontend (forms, buttons)
2. JavaScript makes fetch() API calls to the backend
3. Express routes handle the requests
4. LibSQL client executes SQL queries on Turso
5. Data is returned as JSON and rendered in the UI

---

## 6. Database Design

### Entity-Relationship Diagram

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   TRANSACTIONS   │     │    CATEGORIES    │     │     BUDGETS      │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ id (PK)          │     │ id (PK)          │
│ type             │     │ name             │     │ category         │
│ amount           │     └──────────────────┘     │ limit_amount     │
│ date             │                              │ period           │
│ category ────────┼──────────────────────────────┤                  │
│ description      │                              └──────────────────┘
│ recurring        │
└──────────────────┘
```

### Table Schemas

#### transactions
```sql
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  type TEXT,           -- 'income' or 'expense'
  amount REAL,         -- Transaction amount
  date TEXT,           -- ISO date string
  category TEXT,       -- Category name
  description TEXT,    -- Optional description
  recurring INTEGER    -- 0 or 1 (boolean)
)
```

#### categories
```sql
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT            -- Category name
)
```

#### budgets
```sql
CREATE TABLE IF NOT EXISTS budgets (
  id TEXT PRIMARY KEY,
  category TEXT,       -- Associated category
  limit_amount REAL,   -- Budget limit
  period TEXT          -- 'monthly', 'weekly', 'yearly'
)
```

---

## 7. Backend Implementation

### Project Structure

```
src/
├── index.ts          # Main server file with routes
└── models.ts         # Data models and classes
```

### models.ts - Data Classes

This file defines TypeScript interfaces and classes for type-safe data handling.

```typescript
// Interface definition for type contract
interface ITransaction {
  id: string;
  amount: number;
  date: Date;
  category: string;
  description: string;
  recurring: boolean;
}

// Base Transaction class
export class Transaction implements ITransaction {
  id: string;
  type: string;
  amount: number;
  date: Date;
  category: string;
  description: string;
  recurring: boolean;

  constructor(
    id: string, 
    type: string, 
    amount: number, 
    date: Date, 
    category: string, 
    description: string, 
    recurring: boolean = false
  ) {
    this.id = id;
    this.type = type;
    this.amount = amount;
    this.date = date;
    this.category = category;
    this.description = description;
    this.recurring = recurring;
  }
}

// Income class inheriting from Transaction
export class Income extends Transaction {
  constructor(
    id: string, 
    amount: number, 
    date: Date, 
    category: string, 
    description: string, 
    recurring: boolean = false
  ) {
    super(id, 'income', amount, date, category, description, recurring);
  }
}

// Expense class inheriting from Transaction
export class Expense extends Transaction {
  constructor(
    id: string, 
    amount: number, 
    date: Date, 
    category: string, 
    description: string, 
    recurring: boolean = false
  ) {
    super(id, 'expense', amount, date, category, description, recurring);
  }
}
```

### index.ts - Server & Routes

```typescript
import express from 'express';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { Transaction, Income, Expense, Category, Budget } from './models';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Database client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Database initialization
const initDB = async () => {
  // Create tables if they don't exist
  await client.execute(`
    CREATE TABLE IF NOT EXISTS transactions (...)
  `);
  
  // Seed default categories
  const catResult = await client.execute('SELECT count(*) as count FROM categories');
  if (Number(catResult.rows[0].count) === 0) {
    await client.execute("INSERT INTO categories (id, name) VALUES ('1', 'Food')");
    await client.execute("INSERT INTO categories (id, name) VALUES ('2', 'Transport')");
  }
};

// Start server after DB is ready
initDB().then(() => {
  app.listen(3000, () => console.log('Server running on port 3000'));
});
```

---

## 8. Frontend Implementation

### index.html Structure

```html
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <!-- Meta tags, fonts, icons, Tailwind config -->
</head>
<body class="antialiased bg-gray-900 text-customText font-sans">
  
  <!-- Sidebar Navigation (Desktop) -->
  <aside id="logo-sidebar">...</aside>
  
  <!-- Main Content Area -->
  <div class="p-4 sm:ml-64">
    <!-- Dashboard Tab -->
    <div id="dashboard" class="tab-content">...</div>
    
    <!-- Transactions Tab -->
    <div id="transactions" class="tab-content hidden">...</div>
    
    <!-- Categories Tab -->
    <div id="categories" class="tab-content hidden">...</div>
    
    <!-- Budgets Tab -->
    <div id="budgets" class="tab-content hidden">...</div>
    
    <!-- Reports Tab -->
    <div id="reports" class="tab-content hidden">...</div>
  </div>
  
  <!-- Bottom Navigation (Mobile) -->
  <div class="fixed bottom-0 sm:hidden">...</div>
  
  <!-- Budget Alert Modal -->
  <div id="budgetAlertModal" class="hidden">...</div>
  
  <!-- JavaScript Logic -->
  <script>...</script>
</body>
</html>
```

### Key JavaScript Functions

#### Tab Navigation
```javascript
function switchTab(tabId) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(t => {
    t.classList.add('hidden');
  });
  
  // Show selected tab
  const content = document.getElementById(tabId);
  content.classList.remove('hidden');
  
  // Load data if needed
  if (tabId === 'dashboard') loadDashboard();
  if (tabId === 'reports') loadReports();
}
```

#### Transaction Form Submission
```javascript
transactionForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const data = {
    type: document.getElementById('type').value,
    amount: parseFloat(document.getElementById('amount').value),
    date: document.getElementById('date').value,
    category: document.getElementById('category').value,
    description: document.getElementById('description').value,
    recurring: document.getElementById('recurring').checked
  };
  
  const res = await fetch('/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  await loadTransactions();
  showNotification('Transaction added successfully', 'success');
});
```

#### Budget Alert Modal
```javascript
function showBudgetAlert(category, spent, limit) {
  const modal = document.getElementById('budgetAlertModal');
  const message = document.getElementById('budgetAlertMessage');
  const details = document.getElementById('budgetAlertDetails');
  
  message.textContent = `You've exceeded your ${category} budget!`;
  details.textContent = `Spent: ₹${spent.toFixed(2)} / Limit: ₹${limit.toFixed(2)}`;
  
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}
```

---

## 9. API Documentation

### Transactions API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions` | Get all transactions |
| POST | `/transactions` | Create new transaction |

**POST /transactions Request Body:**
```json
{
  "type": "expense",
  "amount": 500,
  "date": "2025-11-25",
  "category": "Food",
  "description": "Groceries",
  "recurring": false
}
```

### Categories API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | Get all categories |
| POST | `/categories` | Create new category |

### Budgets API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/budgets` | Get all budgets |
| POST | `/budgets` | Create new budget |

### Reports API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/monthly` | Get monthly summary |
| GET | `/reports/csv` | Export as CSV file |

---

## 10. Code Explanations

### Object-Oriented Programming Concepts

#### 1. Inheritance
The `Income` and `Expense` classes extend the base `Transaction` class:

```typescript
export class Income extends Transaction {
  constructor(...) {
    super(id, 'income', amount, date, category, description, recurring);
  }
}
```

**Explanation:** `super()` calls the parent constructor with `type` set to 'income', reusing the base class logic.

#### 2. Interfaces
TypeScript interfaces define contracts for objects:

```typescript
interface ITransaction {
  id: string;
  amount: number;
  // ...
}

export class Transaction implements ITransaction { ... }
```

**Explanation:** The `implements` keyword ensures the class follows the interface structure.

#### 3. Encapsulation
Classes bundle data and methods together:

```typescript
export class Budget implements IBudget {
  id: string;
  category: string;
  limit: number;
  period: string;
}
```

### Asynchronous Programming

#### Async/Await Pattern
```typescript
app.get('/transactions', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM transactions');
    res.json(transactions);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});
```

**Explanation:** 
- `async` marks the function as asynchronous
- `await` pauses execution until the Promise resolves
- `try/catch` handles errors gracefully

### Frontend Fetch API

```javascript
const res = await fetch('/transactions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
const result = await res.json();
```

**Explanation:** The Fetch API provides a modern way to make HTTP requests from the browser.

---

## 11. Features Demonstration

### Feature 1: Dashboard
- Total balance with up/down arrow indicator
- Income and expense summaries
- Doughnut chart for spending analytics
- Recent transactions list

### Feature 2: Transaction Management
- Add income or expense
- Select category (hidden for income)
- Set as recurring transaction
- View transaction history with icons

### Feature 3: Budget Tracking
- Create budget per category
- Visual progress bar
- Color changes based on usage (green → yellow → red)
- Modal alert when budget exceeded

### Feature 4: Reports
- Bar chart showing category-wise spending
- CSV export functionality

### Feature 5: Responsive Design
- Sidebar navigation on desktop
- Bottom navigation bar on mobile
- Touch-friendly interface

---

## 12. Installation & Setup

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd web-tech-expense-tracker
```

### Step 2: Install Dependencies
```bash
pnpm install
```

### Step 3: Configure Environment
Create a `.env` file:
```
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

### Step 4: Run Development Server
```bash
pnpm run dev
```

### Step 5: Access Application
Open `http://localhost:3000` in your browser.

---

## 13. Future Enhancements

1. **User Authentication** - Login/signup with JWT tokens
2. **Multiple Currencies** - Support for different currencies
3. **Recurring Transaction Automation** - Auto-add recurring transactions
4. **Data Backup** - Cloud backup and restore
5. **Bill Reminders** - Push notifications for upcoming bills
6. **Investment Tracking** - Track stocks, mutual funds
7. **Multi-device Sync** - Real-time sync across devices

---

## 14. Viva Questions & Answers

### Q1: What is the difference between `let`, `const`, and `var` in JavaScript?
**Answer:**
- `var` - Function scoped, can be redeclared, hoisted
- `let` - Block scoped, can be reassigned, not hoisted
- `const` - Block scoped, cannot be reassigned (but objects can be mutated)

### Q2: Explain the concept of inheritance in TypeScript.
**Answer:** Inheritance allows a class to extend another class, inheriting its properties and methods. In our project, `Income` and `Expense` extend `Transaction` using the `extends` keyword and call `super()` to invoke the parent constructor.

### Q3: What is REST API?
**Answer:** REST (Representational State Transfer) is an architectural style for designing networked applications. It uses HTTP methods:
- GET - Retrieve data
- POST - Create new data
- PUT - Update existing data
- DELETE - Remove data

### Q4: How does the Fetch API work?
**Answer:** Fetch is a modern JavaScript API for making HTTP requests. It returns a Promise that resolves to the Response object. We use `await res.json()` to parse the response body as JSON.

### Q5: What is Tailwind CSS and why use it?
**Answer:** Tailwind is a utility-first CSS framework that provides low-level utility classes like `p-4`, `text-xl`, `bg-gray-800`. Benefits:
- Faster development
- Consistent design system
- Smaller file size with purging
- Easy customization

### Q6: Explain async/await in JavaScript.
**Answer:** `async/await` is syntactic sugar over Promises:
- `async` function returns a Promise
- `await` pauses execution until Promise resolves
- Makes asynchronous code look synchronous

### Q7: What is LibSQL/Turso?
**Answer:** Turso is an edge-hosted database built on LibSQL (a fork of SQLite). It provides:
- Global replication
- Low latency reads
- SQLite compatibility
- Serverless architecture

### Q8: What are interfaces in TypeScript?
**Answer:** Interfaces define contracts that objects must follow. They describe the shape of an object without implementation details. Classes use `implements` to follow an interface.

### Q9: Explain the Model-View-Controller (MVC) pattern.
**Answer:**
- **Model** - Data and business logic (our TypeScript classes)
- **View** - User interface (HTML/CSS)
- **Controller** - Handles requests (Express routes)

### Q10: What is middleware in Express?
**Answer:** Middleware are functions that have access to request, response, and next function. Examples:
- `express.json()` - Parses JSON body
- `express.static()` - Serves static files

### Q11: How do you handle errors in async functions?
**Answer:** Using try-catch blocks:
```javascript
try {
  const result = await someAsyncOperation();
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed' });
}
```

### Q12: What is Chart.js used for?
**Answer:** Chart.js is a JavaScript library for creating interactive charts. We use it for:
- Doughnut chart (spending analytics)
- Bar chart (monthly report)

### Q13: Explain the purpose of `.env` file.
**Answer:** `.env` stores environment variables like API keys and database URLs. Benefits:
- Keeps sensitive data out of code
- Different values for dev/prod environments
- Loaded using `dotenv` package

### Q14: What is responsive design?
**Answer:** Responsive design ensures websites work on all screen sizes. Techniques:
- CSS media queries
- Flexible grids
- Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`)

### Q15: How does the budget alert feature work?
**Answer:**
1. When adding an expense, check if category has a budget
2. Calculate total spent in that category
3. If spent > limit, show modal alert
4. Uses JavaScript DOM manipulation to toggle visibility

---

## 15. Conclusion

ExpenseTrack Pro demonstrates a complete full-stack web application built with modern technologies. The project showcases:

- **Backend Development** with Node.js, Express, and TypeScript
- **Database Management** with Turso (LibSQL)
- **Frontend Design** with Tailwind CSS and responsive layouts
- **Data Visualization** with Chart.js
- **Object-Oriented Programming** with TypeScript classes and interfaces
- **RESTful API Design** for CRUD operations

The application provides practical value for personal finance management while serving as an excellent learning project for web development concepts.

---

**Project Repository:** GitHub  
**Technologies:** Node.js, Express, TypeScript, Turso, Tailwind CSS, Chart.js  
**Date:** November 2025

---

## 16. System Workflow & Architecture Mindmap

### Complete Application Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER OPENS APPLICATION                          │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   BROWSER LOADS index.html                              │
│                   • Tailwind CSS Loaded                                 │
│                   • Chart.js Loaded                                     │
│                   • JavaScript Initialized                              │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   DASHBOARD TAB LOADS (DEFAULT)                         │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  1. fetch('/transactions')      ──────────────┐                │    │
│  │  2. fetch('/budgets')           ──────────────┤                │    │
│  │  3. Calculate totals                          │                │    │
│  │  4. Render Chart.js doughnut chart            │                │    │
│  └───────────────────────────────────────────────┼────────────────┘    │
└───────────────────────────────────────────────────┼─────────────────────┘
                                                    │
                    ┌───────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        EXPRESS.JS SERVER                                │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  app.get('/transactions', async (req, res) => {                │    │
│  │    const result = await client.execute('SELECT * FROM ...');   │    │
│  │    res.json(transactions);                                     │    │
│  │  });                                                           │    │
│  └───────────────────────────────┬────────────────────────────────┘    │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        TURSO DATABASE (LibSQL)                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  • transactions table → SELECT all records                     │    │
│  │  • budgets table → SELECT all budget limits                    │    │
│  │  • categories table → SELECT category names                    │    │
│  └───────────────────────────────┬────────────────────────────────┘    │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │
                                     │ Returns JSON data
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       FRONTEND RENDERS UI                               │
│  • Update balance display (Total, Income, Expense)                     │
│  • Generate spending chart with categories                             │
│  • Display recent transactions list                                    │
└─────────────────────────────────────────────────────────────────────────┘


                    USER INTERACTION FLOWS
                    =====================

┌──────────────────────────────────────────────────────────────────────────┐
│  FLOW 1: ADD NEW TRANSACTION                                            │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  User clicks "Transactions" tab                                         │
│         │                                                                │
│         ▼                                                                │
│  Fills form: Type, Amount, Date, Category, Description                  │
│         │                                                                │
│         ▼                                                                │
│  Clicks "Add Transaction" button                                        │
│         │                                                                │
│         ▼                                                                │
│  JavaScript validates form                                              │
│         │                                                                │
│         ▼                                                                │
│  fetch('/transactions', { method: 'POST', body: JSON.stringify(data) }) │
│         │                                                                │
│         ▼                                                                │
│  Express route: POST /transactions                                      │
│         │                                                                │
│         ▼                                                                │
│  Generate unique ID with crypto.randomUUID()                            │
│         │                                                                │
│         ▼                                                                │
│  INSERT INTO transactions VALUES (...)                                  │
│         │                                                                │
│         ▼                                                                │
│  Check if expense exceeds budget limit                                  │
│         │                                                                │
│         ├─────► IF EXCEEDED ──► Return { exceeded: true, ... }          │
│         │                              │                                │
│         │                              ▼                                │
│         │                     showBudgetAlert() modal                   │
│         │                                                                │
│         └─────► IF OK ──► Return { success: true }                      │
│                                    │                                    │
│                                    ▼                                    │
│                         Reload transactions list                        │
│                         Update dashboard chart                          │
│                         Show success notification                       │
└──────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│  FLOW 2: SET BUDGET ALERT                                               │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  User clicks "Budgets" tab                                              │
│         │                                                                │
│         ▼                                                                │
│  Fills form: Category, Limit Amount, Period                             │
│         │                                                                │
│         ▼                                                                │
│  fetch('/budgets', { method: 'POST', ... })                             │
│         │                                                                │
│         ▼                                                                │
│  INSERT INTO budgets (category, limit_amount, period)                   │
│         │                                                                │
│         ▼                                                                │
│  Budgets list reloaded with progress bars                               │
│         │                                                                │
│         ▼                                                                │
│  For each budget:                                                       │
│    • Calculate spent = SUM(transactions WHERE category = X)             │
│    • Calculate percentage = (spent / limit) * 100                       │
│    • Color code: Green < 70%, Yellow < 90%, Red >= 90%                  │
└──────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│  FLOW 3: GENERATE MONTHLY REPORT                                        │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  User clicks "Reports" tab                                              │
│         │                                                                │
│         ▼                                                                │
│  fetch('/reports/monthly')                                              │
│         │                                                                │
│         ▼                                                                │
│  SQL: SELECT category, SUM(amount) FROM transactions                    │
│       WHERE type='expense' GROUP BY category                            │
│         │                                                                │
│         ▼                                                                │
│  Returns { Food: 5000, Transport: 2000, ... }                           │
│         │                                                                │
│         ▼                                                                │
│  Render Bar Chart with Chart.js                                         │
│         │                                                                │
│         ▼                                                                │
│  User clicks "Export CSV"                                               │
│         │                                                                │
│         ▼                                                                │
│  fetch('/reports/csv')                                                  │
│         │                                                                │
│         ▼                                                                │
│  Backend generates CSV string                                           │
│  'Date,Type,Category,Amount,Description\n...'                           │
│         │                                                                │
│         ▼                                                                │
│  Browser downloads file as 'expense-report.csv'                         │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 17. Technology Stack Integration Flow

### Frontend → Backend → Database Architecture

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND LAYER                                  │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   HTML5     │  │  Tailwind   │  │  Chart.js   │  │  Vanilla    │    │
│  │   (DOM)     │  │    CSS      │  │  (Canvas)   │  │     JS      │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│         │                │                │                │            │
│         └────────────────┴────────────────┴────────────────┘            │
│                              │                                           │
│                              ▼                                           │
│              ┌──────────────────────────────────┐                        │
│              │  User Interaction Events         │                        │
│              │  • Form submissions              │                        │
│              │  • Button clicks                 │                        │
│              │  • Tab navigation                │                        │
│              └──────────────┬───────────────────┘                        │
└─────────────────────────────┼────────────────────────────────────────────┘
                              │
                              ▼ fetch() API calls
┌───────────────────────────────────────────────────────────────────────────┐
│                           API COMMUNICATION                               │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  POST /transactions          GET /transactions                           │
│  POST /categories      ◄───► GET /categories                             │
│  POST /budgets               GET /budgets                                │
│  GET /reports/monthly        GET /reports/csv                            │
│                                                                           │
│  Request Format: { method: 'POST', headers: {...}, body: JSON }          │
│  Response Format: JSON { data: [...], success: true }                    │
│                                                                           │
└─────────────────────────────┬─────────────────────────────────────────────┘
                              │
                              ▼ HTTP Requests
┌───────────────────────────────────────────────────────────────────────────┐
│                          BACKEND LAYER                                    │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    Node.js Runtime                                │   │
│  │  ┌────────────────────────────────────────────────────────────┐  │   │
│  │  │                 Express.js Framework                        │  │   │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │   │
│  │  │  │              TypeScript Layer                         │  │  │   │
│  │  │  │  • Type checking                                     │  │  │   │
│  │  │  │  • Interfaces (ITransaction, IBudget, ...)         │  │  │   │
│  │  │  │  • Classes (Transaction, Income, Expense, ...)     │  │  │   │
│  │  │  └──────────────────────────────────────────────────────┘  │  │   │
│  │  │                                                              │  │   │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │   │
│  │  │  │           Express Route Handlers                     │  │  │   │
│  │  │  │                                                       │  │  │   │
│  │  │  │  app.get('/transactions', async (req, res) => {     │  │  │   │
│  │  │  │    const result = await client.execute(...);        │  │  │   │
│  │  │  │    res.json(result.rows);                           │  │  │   │
│  │  │  │  });                                                 │  │  │   │
│  │  │  │                                                       │  │  │   │
│  │  │  │  app.post('/transactions', async (req, res) => {    │  │  │   │
│  │  │  │    const { type, amount, ... } = req.body;          │  │  │   │
│  │  │  │    await client.execute('INSERT INTO ...');         │  │  │   │
│  │  │  │  });                                                 │  │  │   │
│  │  │  └──────────────────────────────────────────────────────┘  │  │   │
│  │  │                                                              │  │   │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │   │
│  │  │  │               Middleware                              │  │  │   │
│  │  │  │  • express.json() - Parse JSON body                  │  │  │   │
│  │  │  │  • express.static('public') - Serve HTML/CSS/JS     │  │  │   │
│  │  │  └──────────────────────────────────────────────────────┘  │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │              @libsql/client Database Driver                       │   │
│  │  createClient({                                                   │   │
│  │    url: 'libsql://database.turso.io',                            │   │
│  │    authToken: 'JWT_TOKEN'                                         │   │
│  │  })                                                               │   │
│  └────────────────────────────┬─────────────────────────────────────┘   │
└───────────────────────────────┼───────────────────────────────────────────┘
                                │
                                ▼ SQL Queries
┌───────────────────────────────────────────────────────────────────────────┐
│                           DATABASE LAYER                                  │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │              Turso Database (LibSQL/SQLite)                       │   │
│  │  • Edge-hosted distributed database                              │   │
│  │  • Global replication for low latency                            │   │
│  │  • SQLite wire protocol                                          │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │  transactions    │  │   categories     │  │     budgets      │      │
│  │  ──────────────  │  │  ──────────────  │  │  ──────────────  │      │
│  │  id (PK)         │  │  id (PK)         │  │  id (PK)         │      │
│  │  type            │  │  name            │  │  category        │      │
│  │  amount          │  └──────────────────┘  │  limit_amount    │      │
│  │  date            │                        │  period          │      │
│  │  category ───────┼────────────────────────┤                  │      │
│  │  description     │                        └──────────────────┘      │
│  │  recurring       │                                                   │
│  └──────────────────┘                                                   │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


        DATA FLOW EXAMPLE: Adding an Expense
        =====================================

┌─────────────────┐
│   User Input    │  User fills form in "Transactions" tab
│   (Frontend)    │  • Type: Expense
└────────┬────────┘  • Amount: 500
         │           • Category: Food
         │           • Description: Groceries
         ▼
┌─────────────────┐
│  Fetch API Call │  fetch('/transactions', {
│   (JavaScript)  │    method: 'POST',
└────────┬────────┘    body: JSON.stringify({...})
         │           })
         │
         ▼ HTTP POST
┌─────────────────┐
│ Express Handler │  app.post('/transactions', async (req, res) => {
│   (Backend)     │    const data = req.body;
└────────┬────────┘    const id = crypto.randomUUID();
         │             ...
         │           });
         ▼
┌─────────────────┐
│  SQL Execute    │  client.execute(`
│  (Turso Client) │    INSERT INTO transactions
└────────┬────────┘    VALUES (?, ?, ?, ?, ?, ?, ?)
         │           `, [id, type, amount, ...]);
         │
         ▼
┌─────────────────┐
│ Database Write  │  Turso writes to transactions table
│   (Turso DB)    │  Replicates to edge locations
└────────┬────────┘
         │
         │ Response
         ▼
┌─────────────────┐
│  Check Budget   │  SELECT SUM(amount) FROM transactions
│    (Backend)    │  WHERE category = 'Food' AND type = 'expense'
└────────┬────────┘  Compare with budget limit
         │
         ├─────► IF spent > limit ──► return { exceeded: true }
         │                                      │
         │                                      ▼
         │                              Frontend shows alert modal
         │
         └─────► IF OK ──► return { success: true }
                                    │
                                    ▼
                           Frontend refreshes transaction list
                           Updates dashboard chart
```

---

## 18. Core Code Snippets

### 1. Database Connection & Initialization

```typescript
import { createClient } from '@libsql/client';

// Create Turso database client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialize database tables
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
  
  // Seed default categories if empty
  const catResult = await client.execute(
    'SELECT count(*) as count FROM categories'
  );
  if (Number(catResult.rows[0].count) === 0) {
    const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping'];
    for (const cat of categories) {
      await client.execute(
        "INSERT INTO categories (id, name) VALUES (?, ?)",
        [crypto.randomUUID(), cat]
      );
    }
  }
};
```

---

### 2. TypeScript Class Inheritance

```typescript
// Base Transaction class
export class Transaction implements ITransaction {
  constructor(
    public id: string,
    public type: string,
    public amount: number,
    public date: Date,
    public category: string,
    public description: string,
    public recurring: boolean = false
  ) {}
}

// Income class extends Transaction
export class Income extends Transaction {
  constructor(
    id: string,
    amount: number,
    date: Date,
    category: string,
    description: string,
    recurring: boolean = false
  ) {
    super(id, 'income', amount, date, category, description, recurring);
  }
}

// Expense class extends Transaction
export class Expense extends Transaction {
  constructor(
    id: string,
    amount: number,
    date: Date,
    category: string,
    description: string,
    recurring: boolean = false
  ) {
    super(id, 'expense', amount, date, category, description, recurring);
  }
}
```

**Key Concept:** The `super()` keyword calls the parent class constructor, avoiding code duplication.

---

### 3. Express POST Route with Budget Check

```typescript
app.post('/transactions', async (req, res) => {
  try {
    const { type, amount, date, category, description, recurring } = req.body;
    const id = crypto.randomUUID();
    
    // Insert transaction into database
    await client.execute(
      `INSERT INTO transactions (id, type, amount, date, category, description, recurring)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, type, amount, date, category, description, recurring ? 1 : 0]
    );
    
    // Check if expense exceeds budget
    if (type === 'expense') {
      const budgetResult = await client.execute(
        'SELECT limit_amount FROM budgets WHERE category = ?',
        [category]
      );
      
      if (budgetResult.rows.length > 0) {
        const limit = Number(budgetResult.rows[0].limit_amount);
        
        // Calculate total spent in this category
        const spentResult = await client.execute(
          `SELECT SUM(amount) as total FROM transactions 
           WHERE category = ? AND type = 'expense'`,
          [category]
        );
        
        const spent = Number(spentResult.rows[0].total) || 0;
        
        if (spent > limit) {
          return res.json({
            success: true,
            exceeded: true,
            category,
            spent,
            limit
          });
        }
      }
    }
    
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});
```

**Key Concept:** This route demonstrates async/await, SQL parameterized queries, and business logic (budget checking).

---

### 4. Frontend Fetch API with Async/Await

```javascript
// Add transaction form submission
transactionForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const data = {
    type: document.getElementById('type').value,
    amount: parseFloat(document.getElementById('amount').value),
    date: document.getElementById('date').value,
    category: document.getElementById('category').value,
    description: document.getElementById('description').value,
    recurring: document.getElementById('recurring').checked
  };
  
  try {
    const res = await fetch('/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await res.json();
    
    if (result.exceeded) {
      showBudgetAlert(result.category, result.spent, result.limit);
    }
    
    await loadTransactions();
    showNotification('Transaction added successfully!', 'success');
    transactionForm.reset();
  } catch (error) {
    showNotification('Failed to add transaction', 'error');
  }
});
```

**Key Concept:** Demonstrates event handling, form data extraction, fetch API, and error handling.

---

### 5. Chart.js Dynamic Data Visualization

```javascript
async function loadDashboard() {
  const res = await fetch('/transactions');
  const transactions = await res.json();
  
  // Calculate totals
  let income = 0, expense = 0;
  const categoryMap = {};
  
  transactions.forEach(t => {
    if (t.type === 'income') income += t.amount;
    else {
      expense += t.amount;
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    }
  });
  
  // Update UI
  document.getElementById('totalBalance').textContent = 
    `₹${(income - expense).toFixed(2)}`;
  document.getElementById('totalIncome').textContent = 
    `₹${income.toFixed(2)}`;
  document.getElementById('totalExpense').textContent = 
    `₹${expense.toFixed(2)}`;
  
  // Render doughnut chart
  const ctx = document.getElementById('spendingChart').getContext('2d');
  const labels = Object.keys(categoryMap);
  const data = Object.values(categoryMap);
  const colors = [
    '#BA875C', '#596B5F', '#FF6384', '#36A2EB', 
    '#FFCE56', '#4BC0C0', '#9966FF'
  ];
  
  if (chart) chart.destroy(); // Destroy previous chart
  
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}
```

**Key Concept:** Data aggregation, DOM manipulation, and Chart.js configuration for interactive visualizations.

---

### 6. Budget Alert Modal Logic

```javascript
function showBudgetAlert(category, spent, limit) {
  const modal = document.getElementById('budgetAlertModal');
  const message = document.getElementById('budgetAlertMessage');
  const details = document.getElementById('budgetAlertDetails');
  
  message.textContent = `⚠️ You've exceeded your ${category} budget!`;
  details.innerHTML = `
    <p>Spent: <span class="text-red-500 font-bold">₹${spent.toFixed(2)}</span></p>
    <p>Limit: <span class="text-gray-400">₹${limit.toFixed(2)}</span></p>
    <p class="mt-2 text-sm">Over budget by: ₹${(spent - limit).toFixed(2)}</p>
  `;
  
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

// Close modal button
document.getElementById('closeBudgetAlert').addEventListener('click', () => {
  const modal = document.getElementById('budgetAlertModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
});
```

**Key Concept:** DOM manipulation for dynamic modal display with calculated budget overrun.

---

### 7. CSV Export Functionality

```typescript
app.get('/reports/csv', async (req, res) => {
  try {
    const result = await client.execute(
      'SELECT * FROM transactions ORDER BY date DESC'
    );
    
    // Build CSV string
    let csv = 'Date,Type,Category,Amount,Description,Recurring\n';
    
    result.rows.forEach(row => {
      csv += `${row.date},${row.type},${row.category},${row.amount},"${row.description}",${row.recurring ? 'Yes' : 'No'}\n`;
    });
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=expense-report.csv');
    res.send(csv);
  } catch (e) {
    res.status(500).json({ error: 'Failed to generate CSV' });
  }
});
```

**Key Concept:** Server-side CSV generation and file download using HTTP headers.

---

### 8. Tab Navigation System

```javascript
function switchTab(tabId) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.add('hidden');
  });
  
  // Remove active styling from all nav links
  document.querySelectorAll('.sidebar-link, .mobile-nav-link').forEach(link => {
    link.classList.remove('bg-gray-700', 'text-primary-500');
  });
  
  // Show selected tab
  document.getElementById(tabId).classList.remove('hidden');
  
  // Highlight active nav link
  document.querySelectorAll(`[onclick*="${tabId}"]`).forEach(link => {
    link.classList.add('bg-gray-700', 'text-primary-500');
  });
  
  // Load data for specific tabs
  if (tabId === 'dashboard') loadDashboard();
  else if (tabId === 'transactions') loadTransactions();
  else if (tabId === 'budgets') loadBudgets();
  else if (tabId === 'reports') loadReports();
}
```

**Key Concept:** Single-page application (SPA) navigation without page reloads.

---

### 9. Budget Progress Bar Rendering

```javascript
async function loadBudgets() {
  const [budgets, transactions] = await Promise.all([
    fetch('/budgets').then(r => r.json()),
    fetch('/transactions').then(r => r.json())
  ]);
  
  const list = document.getElementById('budgetsList');
  list.innerHTML = '';
  
  budgets.forEach(budget => {
    // Calculate spent amount
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const percentage = Math.min((spent / budget.limit_amount) * 100, 100);
    
    // Determine color based on percentage
    let colorClass = 'bg-green-500';
    if (percentage >= 90) colorClass = 'bg-red-500';
    else if (percentage >= 70) colorClass = 'bg-yellow-500';
    
    const html = `
      <div class="bg-gray-800 p-4 rounded-lg">
        <div class="flex justify-between mb-2">
          <span class="font-semibold">${budget.category}</span>
          <span class="text-sm">₹${spent.toFixed(2)} / ₹${budget.limit_amount}</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2.5">
          <div class="${colorClass} h-2.5 rounded-full transition-all duration-300" 
               style="width: ${percentage}%"></div>
        </div>
        <p class="text-xs text-gray-400 mt-1">${percentage.toFixed(1)}% used</p>
      </div>
    `;
    
    list.innerHTML += html;
  });
}
```

**Key Concept:** Parallel API calls with `Promise.all()`, data aggregation, and dynamic styling based on calculations.

---

### 10. Express Middleware Configuration

```typescript
import express from 'express';
import path from 'path';

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static('public'));

// CORS headers (if needed for production)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
```

**Key Concept:** Middleware functions process requests in order, adding functionality like JSON parsing and error handling.

---

*This report was prepared as part of the Web Technologies Lab Project.*
