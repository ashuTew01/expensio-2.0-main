import express from 'express';
import { getExpenses, createExpense } from '../controllers/expenseController.js';

const router = express.Router();

// Get all expenses
router.get('/', getExpenses);

// Create a new expense
router.post('/', createExpense);

export default router;
