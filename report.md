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

*This report was prepared as part of the Web Technologies Lab Project.*
