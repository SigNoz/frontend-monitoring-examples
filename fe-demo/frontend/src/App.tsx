import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ExpenseFormPage from './pages/ExpenseFormPage';
import { Expense } from './types';
import { expenseApi } from './services/api';
import { logInfo, logError } from './otel/logger_utils';
import { useMetrics } from './otel/useMetrics';

function AppWithMetrics() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch expenses on app load
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expenseApi.getAll();
      setExpenses(data);
      logInfo('Successfully fetched expenses', { count: data.length });
    } catch (err) {
      const errorMessage = 'Failed to fetch expenses';
      setError(errorMessage);
      logError('Failed to fetch expenses', {
        error: err instanceof Error ? err.message : String(err),
      });
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (
    expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const newExpense = await expenseApi.create(expense);
      setExpenses(prev => [newExpense, ...prev]);
      logInfo('Successfully created expense', {
        id: newExpense.id,
        title: newExpense.title,
      });
      return newExpense;
    } catch (err) {
      logError('Failed to create expense', {
        title: expense.title,
        error: err instanceof Error ? err.message : String(err),
      });
      console.error('Error adding expense:', err);
      throw err;
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const updatedExpense = await expenseApi.update(id, updates);
      setExpenses(prev =>
        prev.map(expense => (expense.id === id ? updatedExpense : expense))
      );
      logInfo('Successfully updated expense', {
        id,
        title: updatedExpense.title,
      });
      return updatedExpense;
    } catch (err) {
      logError('Failed to update expense', {
        id,
        error: err instanceof Error ? err.message : String(err),
      });
      console.error('Error updating expense:', err);
      throw err;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await expenseApi.delete(id);
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      logInfo('Successfully deleted expense', { id });
    } catch (err) {
      logError('Failed to delete expense', {
        id,
        error: err instanceof Error ? err.message : String(err),
      });
      console.error('Error deleting expense:', err);
      throw err;
    }
  };

  const refreshExpenses = () => {
    fetchExpenses();
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Toaster
        position='top-right'
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
        }}
      />
      <Layout>
        <Routes>
          <Route
            path='/'
            element={
              <HomePage
                expenses={expenses}
                loading={loading}
                error={error}
                onDelete={deleteExpense}
                onRefresh={refreshExpenses}
              />
            }
          />
          <Route
            path='/expense/new'
            element={
              <ExpenseFormPage
                onCreate={addExpense}
                onUpdate={updateExpense}
                mode='create'
              />
            }
          />
          <Route
            path='/expense/:id/edit'
            element={
              <ExpenseFormPage
                onCreate={addExpense}
                onUpdate={updateExpense}
                mode='edit'
              />
            }
          />
        </Routes>
      </Layout>
    </div>
  );
}

function App() {
  useMetrics();
  return <AppWithMetrics />;
}

export default App;
