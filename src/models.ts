interface ITransaction {
  id: string;
  amount: number;
  date: Date;
  category: string;
  description: string;
  recurring: boolean;
}

interface ICategory {
  id: string;
  name: string;
}

interface IBudget {
  id: string;
  category: string;
  limit: number;
  period: string;
}

export class Transaction implements ITransaction {
  id: string;
  type: string;
  amount: number;
  date: Date;
  category: string;
  description: string;
  recurring: boolean;

  constructor(id: string, type: string, amount: number, date: Date, category: string, description: string, recurring: boolean = false) {
    this.id = id;
    this.type = type;
    this.amount = amount;
    this.date = date;
    this.category = category;
    this.description = description;
    this.recurring = recurring;
  }
}

export class Income extends Transaction {
  constructor(id: string, amount: number, date: Date, category: string, description: string, recurring: boolean = false) {
    super(id, 'income', amount, date, category, description, recurring);
  }
}

export class Expense extends Transaction {
  constructor(id: string, amount: number, date: Date, category: string, description: string, recurring: boolean = false) {
    super(id, 'expense', amount, date, category, description, recurring);
  }
}

export class Category implements ICategory {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class Budget implements IBudget {
  id: string;
  category: string;
  limit: number;
  period: string; // e.g., 'monthly'

  constructor(id: string, category: string, limit: number, period: string) {
    this.id = id;
    this.category = category;
    this.limit = limit;
    this.period = period;
  }
}