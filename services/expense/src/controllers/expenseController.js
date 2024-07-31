import Expense from '../models/expenseModel.js';

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Public
export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Public
export const createExpense = async (req, res) => {
    const { title, amount, date, category, description } = req.body;

    const newExpense = new Expense({ title, amount, date, category, description });

    try {
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
