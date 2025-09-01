import { sql } from '../database/connection.js';
import { Expense, CreateExpenseRequest } from '../types/index.js';

type ExpenseRow = {
  id: string;
  title: string;
  amount: string | number;
  category: string;
  date: string | Date;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

function mapRowToExpense(row: ExpenseRow): Expense {
  const dateStr =
    row.date instanceof Date ? row.date.toISOString() : String(row.date);
  return {
    id: row.id,
    title: row.title,
    amount:
      typeof row.amount === 'number' ? row.amount : parseFloat(row.amount),
    category: row.category,
    date: dateStr.split('T')[0],
    description: row.description ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class ExpenseService {
  async getAllExpenses(): Promise<Expense[]> {
    try {
      const expenses = await sql`
        SELECT 
          id,
          title,
          amount,
          category,
          date,
          description,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM expenses 
        ORDER BY date DESC, created_at DESC
      `;

      return (expenses as any[]).map(row => mapRowToExpense(row));
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw new Error('Failed to fetch expenses');
    }
  }

  async getExpenseById(id: string): Promise<Expense | null> {
    try {
      const [expense] = await sql`
        SELECT 
          id,
          title,
          amount,
          category,
          date,
          description,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM expenses 
        WHERE id = ${id}
      `;

      if (!expense) return null;

      return mapRowToExpense(expense as any);
    } catch (error) {
      console.error('Error fetching expense:', error);
      throw new Error('Failed to fetch expense');
    }
  }

  async createExpense(expenseData: CreateExpenseRequest): Promise<Expense> {
    try {
      const [newExpense] = await sql`
        INSERT INTO expenses (title, amount, category, date, description)
        VALUES (${expenseData.title}, ${expenseData.amount}, ${expenseData.category}, ${expenseData.date}, ${expenseData.description})
        RETURNING 
          id,
          title,
          amount,
          category,
          date,
          description,
          created_at as "createdAt",
          updated_at as "updatedAt"
      `;

      return mapRowToExpense(newExpense as any);
    } catch (error) {
      console.error('Error creating expense:', error);
      throw new Error('Failed to create expense');
    }
  }

  async updateExpense(
    id: string,
    expenseData: Partial<CreateExpenseRequest>
  ): Promise<Expense | null> {
    try {
      const title = expenseData.title ?? null;
      const amount = expenseData.amount ?? null;
      const category = expenseData.category ?? null;
      const date = expenseData.date ?? null;
      const description = expenseData.description ?? null;

      const [updatedExpense] = await sql`
        UPDATE expenses
        SET
          title = COALESCE(${title}, title),
          amount = COALESCE(${amount}, amount),
          category = COALESCE(${category}, category),
          date = COALESCE(${date}, date),
          description = COALESCE(${description}, description),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING 
          id,
          title,
          amount,
          category,
          date,
          description,
          created_at as "createdAt",
          updated_at as "updatedAt"
      `;

      if (!updatedExpense) return null;
      return mapRowToExpense(updatedExpense as any);
    } catch (error) {
      console.error('Error updating expense:', error);
      throw new Error('Failed to update expense');
    }
  }

  async deleteExpense(id: string): Promise<boolean> {
    try {
      const result = await sql`
        DELETE FROM expenses 
        WHERE id = ${id}
        RETURNING id
      `;

      return (result as any[]).length > 0;
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw new Error('Failed to delete expense');
    }
  }

  async getExpensesByCategory(category: string): Promise<Expense[]> {
    try {
      const expenses = await sql`
        SELECT 
          id,
          title,
          amount,
          category,
          date,
          description,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM expenses 
        WHERE category = ${category}
        ORDER BY date DESC, created_at DESC
      `;

      return (expenses as any[]).map(row => mapRowToExpense(row));
    } catch (error) {
      console.error('Error fetching expenses by category:', error);
      throw new Error('Failed to fetch expenses by category');
    }
  }

  async getTotalExpenses(): Promise<number> {
    try {
      const [result] = await sql`
        SELECT COALESCE(SUM(amount), 0) as total
        FROM expenses
      `;

      const total = (result as any)?.total;
      return typeof total === 'number' ? total : parseFloat(total);
    } catch (error) {
      console.error('Error calculating total expenses:', error);
      throw new Error('Failed to calculate total expenses');
    }
  }
}
