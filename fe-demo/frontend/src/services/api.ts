import axios from 'axios';
import { Expense, CreateExpenseRequest, ApiResponse } from '../types';
import { logInfo, logWarn, logError } from '../otel/logger_utils';

// Point to your separate backend deployment
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  config => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for logging
api.interceptors.response.use(
  response => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    logError('API Response error', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      error: error.message,
      responseData: error.response?.data,
    });
    console.error('API Response error:', error);
    return Promise.reject(error);
  }
);

export const expenseApi = {
  // Get all expenses
  getAll: async (): Promise<Expense[]> => {
    try {
      const response = await api.get<ApiResponse<Expense[]>>('/expenses');
      const expenses = response.data.data || [];
      logInfo('Successfully fetched all expenses', { count: expenses.length });
      return expenses;
    } catch (error) {
      logError('Failed to fetch all expenses', {
        error: error instanceof Error ? error.message : String(error),
      });
      console.error('Failed to fetch all expenses:', error);
      throw error;
    }
  },

  // Get expense by ID
  getById: async (id: string): Promise<Expense | null> => {
    try {
      const response = await api.get<ApiResponse<Expense>>(`/expenses/${id}`);
      const expense = response.data.data || null;
      if (expense) {
        logInfo('Successfully fetched expense by ID', {
          id,
          title: expense.title,
        });
      } else {
        logWarn('Expense not found by ID', { id });
      }
      return expense;
    } catch (error) {
      logError('Failed to fetch expense by ID', {
        id,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error('Failed to fetch expense by ID:', error);
      throw error;
    }
  },

  // Create new expense
  create: async (expense: CreateExpenseRequest): Promise<Expense> => {
    try {
      const response = await api.post<ApiResponse<Expense>>(
        '/expenses',
        expense
      );
      const newExpense = response.data.data!;
      logInfo('Successfully created expense', {
        id: newExpense.id,
        title: newExpense.title,
        amount: newExpense.amount,
      });
      return newExpense;
    } catch (error) {
      logError('Failed to create expense', {
        expenseData: {
          title: expense.title,
          amount: expense.amount,
          category: expense.category,
        },
        error: error instanceof Error ? error.message : String(error),
      });
      console.error('Failed to create expense:', error);
      throw error;
    }
  },

  // Update expense
  update: async (
    id: string,
    expense: Partial<CreateExpenseRequest>
  ): Promise<Expense> => {
    try {
      const response = await api.put<ApiResponse<Expense>>(
        `/expenses/${id}`,
        expense
      );
      const updatedExpense = response.data.data!;
      logInfo('Successfully updated expense', {
        id,
        title: updatedExpense.title,
        changes: expense,
      });
      return updatedExpense;
    } catch (error) {
      logError('Failed to update expense', {
        id,
        updates: expense,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error('Failed to update expense:', error);
      throw error;
    }
  },

  // Delete expense
  delete: async (id: string): Promise<boolean> => {
    try {
      const response = await api.delete<ApiResponse<void>>(`/expenses/${id}`);
      const success = response.data.success;
      if (success) {
        logInfo('Successfully deleted expense', { id });
      } else {
        logWarn('Expense deletion returned false success', { id });
      }
      return success;
    } catch (error) {
      logError('Failed to delete expense', {
        id,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error('Failed to delete expense:', error);
      throw error;
    }
  },

  // Get expenses by category
  getByCategory: async (category: string): Promise<Expense[]> => {
    try {
      const response = await api.get<ApiResponse<Expense[]>>(
        `/expenses/category/${category}`
      );
      const expenses = response.data.data || [];
      logInfo('Successfully fetched expenses by category', {
        category,
        count: expenses.length,
      });
      return expenses;
    } catch (error) {
      logError('Failed to fetch expenses by category', {
        error: error instanceof Error ? error.message : String(error),
      });
      console.error('Failed to fetch expenses by category:', error);
      throw error;
    }
  },

  // Get total expenses
  getTotal: async (): Promise<number> => {
    try {
      logInfo('Fetching total expenses amount');
      const response = await api.get<ApiResponse<{ total: number }>>(
        '/expenses/stats/total'
      );
      const total = response.data.data?.total || 0;
      logInfo('Successfully fetched total expenses', { total });
      return total;
    } catch (error) {
      logError('Failed to fetch total expenses', {
        error: error instanceof Error ? error.message : String(error),
      });
      console.error('Failed to fetch total expenses:', error);
      throw error;
    }
  },
};

export default api;
