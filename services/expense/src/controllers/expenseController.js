import Joi from "joi";
import {
	createExpenseService,
	deleteExpensesByIdsService,
	getExpensesService,
} from "../services/expenseService.js";
import { ValidationError } from "@expensio/sharedlib";

// @desc    Get user's single/multiple expense(s) based on query
// @route   GET
// @access  Private
export const getExpensesController = async (req, res) => {
	const querySchema = Joi.object({
		start_date: Joi.date().iso().optional(),
		end_date: Joi.date().iso().optional(),
		search: Joi.string().max(200).optional(),
		eventId: Joi.string()
			.optional()
			.pattern(/^[0-9a-fA-F]{24}$/),
		categoryId: Joi.string()
			.optional()
			.pattern(/^[0-9a-fA-F]{24}$/),
		cognitiveTriggerId: Joi.string()
			.optional()
			.pattern(/^[0-9a-fA-F]{24}$/),
		mood: Joi.string().valid("happy", "neutral", "regretful").optional(),
		page: Joi.number().integer().min(1).optional(),
		pageSize: Joi.number().integer().min(1).optional(),
		id: Joi.string()
			.optional()
			.pattern(/^[0-9a-fA-F]{24}$/),
	});
	try {
		const userId = req.user.id;

		const { error, value } = querySchema.validate(req.query);
		if (error) {
			throw new ValidationError(error.details[0].message);
		}

		const expensesData = await getExpensesService(value, userId);

		res.status(200).json(expensesData);
	} catch (error) {
		next(error);
	}
};

// @desc    Create a new expense
// @route   POST
// @access  Private
export const addExpenseController = async (req, res, next) => {
	const expenseSchema = Joi.object({
		title: Joi.string().max(200).required(),
		description: Joi.string().max(1000).optional(),
		expenseType: Joi.string()
			.valid("necessity", "luxury", "investment", "saving")
			.required(),
		isRecurring: Joi.boolean().optional(),
		notes: Joi.array().items(Joi.string().max(300)).max(10).optional(),
		amount: Joi.number().positive().required(),
		categoryCode: Joi.string().required(),
		cognitiveTriggerCode: Joi.string().optional(),
		image: Joi.string().max(300).optional(),
		paymentMethod: Joi.string()
			.valid("cash", "credit_card", "debit_card", "online_payment", "unknown")
			.optional(),
		mood: Joi.string().valid("happy", "neutral", "regretful").optional(),
		eventId: Joi.string()
			.pattern(/^[0-9a-fA-F]{24}$/)
			.optional(),
	});
	try {
		const userId = req.user.id;

		const { error, value } = expenseSchema.validate(req.body);
		if (error) {
			throw new ValidationError(error.details[0].message);
		}

		const newExpense = await createExpenseService(value, userId);

		res.status(201).json({
			message: "Expense added successfully!",
			expense: newExpense,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Deletes expenses, receives array expenses containing expenseIds
// @route   POST
// @access  Private
export const deleteExpensesController = async (req, res, next) => {
	try {
		const userId = req.user.id;

		const deleteExpensesSchema = Joi.object({
			expenses: Joi.array()
				.items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
				.required(),
		});

		const { error, value } = deleteExpensesSchema.validate(req.body);
		if (error) {
			throw new ValidationError(error.details[0].message);
		}

		const result = await deleteExpensesByIdsService(value.expenses, userId);

		res.status(200).json({
			message: `${result.deletedCount} expense(s) deleted successfully!`,
		});
	} catch (error) {
		next(error);
	}
};
