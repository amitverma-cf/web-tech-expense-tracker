# Expense Tracker API

## Setup
pnpm install
pnpm build
pnpm start

## UI
Open http://localhost:3000 in browser for UI with forms and charts.

## Endpoints
- POST /transactions: { type: 'income'|'expense', amount, date, category, description, recurring? }
- GET /transactions
- POST /categories: { name }
- GET /categories
- POST /budgets: { category, limit, period }
- GET /budgets
- GET /reports/monthly
- GET /reports/csv

Data persisted in CSV files: transactions.csv, categories.csv, budgets.csv.