import express from 'express';
import { ExpenseService } from '../services/expenseService.js';
import {
  CreateExpenseRequest,
  Expense,
  UpdateExpenseRequest,
} from '../types/index.js';

const router = express.Router();
const expenseService = new ExpenseService();

// Get all expenses
router.get('/', async (req: express.Request, res: express.Response<any>) => {
  try {
    const expenses = await expenseService.getAllExpenses();
    res.json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.error('Error in GET /expenses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch expenses',
    });
  }
});

// Get expense by ID
router.get('/:id', async (req: express.Request, res: express.Response<any>) => {
  try {
    const { id } = req.params;
    const expense = await expenseService.getExpenseById(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found',
      });
    }

    res.json({
      success: true,
      data: expense,
    });
  } catch (error) {
    console.error('Error in GET /expenses/:id:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch expense',
    });
  }
});

// Create new expense
router.post('/', async (req: express.Request, res: express.Response<any>) => {
  try {
    const expenseData: CreateExpenseRequest = req.body;

    // Basic validation
    if (
      !expenseData.title ||
      !expenseData.amount ||
      !expenseData.category ||
      !expenseData.date
    ) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, amount, category, date',
      });
    }

    if (expenseData.amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0',
      });
    }

    const newExpense = await expenseService.createExpense(expenseData);

    res.status(201).json({
      success: true,
      data: newExpense,
      message: 'Expense created successfully',
    });
  } catch (error) {
    console.error('Error in POST /expenses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create expense',
    });
  }
});

// Update expense
router.put('/:id', async (req: express.Request, res: express.Response<any>) => {
  try {
    const { id } = req.params;
    const updateData: UpdateExpenseRequest = req.body;

    if (updateData.amount !== undefined && updateData.amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0',
      });
    }

    const updatedExpense = await expenseService.updateExpense(id, updateData);

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found',
      });
    }

    res.json({
      success: true,
      data: updatedExpense,
      message: 'Expense updated successfully',
    });
  } catch (error) {
    console.error('Error in PUT /expenses/:id:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update expense',
    });
  }
});

// Delete expense
router.delete(
  '/:id',
  async (req: express.Request, res: express.Response<any>) => {
    try {
      const { id } = req.params;
      const deleted = await expenseService.deleteExpense(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Expense not found',
        });
      }

      res.json({
        success: true,
        message: 'Expense deleted successfully',
      });
    } catch (error) {
      console.error('Error in DELETE /expenses/:id:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete expense',
      });
    }
  }
);

// Get expenses by category
router.get(
  '/category/:category',
  async (req: express.Request, res: express.Response<any>) => {
    try {
      const { category } = req.params;
      const expenses = await expenseService.getExpensesByCategory(category);

      res.json({
        success: true,
        data: expenses,
      });
    } catch (error) {
      console.error('Error in GET /expenses/category/:category:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch expenses by category',
      });
    }
  }
);

// Get total expenses
router.get(
  '/stats/total',
  async (req: express.Request, res: express.Response<any>) => {
    try {
      const total = await expenseService.getTotalExpenses();

      res.json({
        success: true,
        data: { total },
      });
    } catch (error) {
      console.error('Error in GET /expenses/stats/total:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate total expenses',
      });
    }
  }
);

export default router;
