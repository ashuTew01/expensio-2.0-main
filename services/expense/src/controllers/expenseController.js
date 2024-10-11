import Joi from "joi";
import {
	addCategoriesService,
	addCognitiveTriggersService,
	addExpensesService,
	deleteExpensesByIdsService,
	getExpensesService,
	removeCategoriesService,
	removeCognitiveTriggersService,
	getCategoriesByIdsService,
	getCognitiveTriggersByIdsService,
	getCognitiveTriggersService,
	getAllCategoriesService,
} from "../services/expenseService.js";
import { ValidationError } from "@expensio/sharedlib";
import Idempotency from "../models/Idempotency.js";

// @desc    Get user's single/multiple expense(s) based on query
// @route   GET
// @access  Private
export const getExpensesController = async (req, res, next) => {
	const querySchema = Joi.object({
		start_date: Joi.date().iso().optional(),
		end_date: Joi.date().iso().optional(),
		search: Joi.string().max(200).optional(),
		eventId: Joi.string()
			.optional()
			.pattern(/^[0-9a-fA-F]{24}$/),
		categoryCode: Joi.string().optional(),
		cognitiveTriggerCodes: Joi.array().items(Joi.string()).single().optional(),
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
			throw new ValidationError("Some query parameters are invalid.", error);
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
export const addExpensesController = async (req, res, next) => {
	try {
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
			cognitiveTriggerCodes: Joi.array()
				.items(Joi.string().optional())
				.optional(),
			image: Joi.string().max(300).optional(),
			paymentMethod: Joi.string()
				.valid("cash", "credit_card", "debit_card", "online_payment", "unknown")
				.optional(),
			mood: Joi.string().valid("happy", "neutral", "regretful").optional(),
			eventId: Joi.string()
				.pattern(/^[0-9a-fA-F]{24}$/)
				.optional(),
			createdAt: Joi.date().iso().optional(),
		});

		const requestSchema = Joi.array().items(expenseSchema).min(1).required();
		const userId = req.user.id;
		const idempotencyKey = req.headers["idempotency-key"];

		if (!idempotencyKey) {
			return res.status(400).json({ message: "Idempotency key is required" });
		}

		const existingEntry = await Idempotency.findOne({ idempotencyKey, userId });

		if (existingEntry) {
			return res.status(200).json(existingEntry.response);
		}

		// Validate request body
		const { error, value } = requestSchema.validate(req.body);
		if (error) {
			throw new ValidationError("Some fields are invalid.", error);
		}

		const newExpenses = await addExpensesService(value, userId);

		const response = {
			message: "Expenses added successfully!",
			expenses: newExpenses,
		};

		// Save the idempotency key and response to the database
		await Idempotency.create({
			idempotencyKey,
			userId,
			response,
		});

		res.status(201).json(response);
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
			throw new ValidationError("Some fields are invalid.", error);
		}

		const result = await deleteExpensesByIdsService(value.expenses, userId);

		res.status(200).json({
			message: `${result.deletedCount} expense(s) deleted successfully!`,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Adds cognitive Triggers
// @route   POST
// @access  Private
export const addCognitiveTriggersController = async (req, res, next) => {
	const cognitiveTriggerSchema = Joi.object({
		name: Joi.string().max(50).required(),
		code: Joi.string().max(80).regex(/^\S+$/).required(),
		description: Joi.string().max(1000).optional(),
	});

	const requestSchema = Joi.array()
		.items(cognitiveTriggerSchema)
		.min(1)
		.required();

	try {
		const { error, value } = requestSchema.validate(req.body);
		if (error) {
			throw new ValidationError("Some fields are invalid.", error);
		}

		const newCognitiveTriggers = await addCognitiveTriggersService(value);

		res.status(201).json({
			message: "Cognitive Triggers added successfully!",
			cognitiveTriggers: newCognitiveTriggers,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Gets Cognitive Triggers
// @route   POST
// @access  Public
// example request {
//    "cognitiveTriggerIds": ["64df88c888e5835cf9c0561d", "64df88c888e5835cf9c0561e"]
// }
// example response {
//     "64df88c888e5835cf9c0561d": "Groceries",
//     "64df88c888e5835cf9c0561e": "Rent",
// }
export const getCognitiveTriggersByIdsController = async (req, res, next) => {
	const schema = Joi.object({
		cognitiveTriggerIds: Joi.array()
			.items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
			.required(),
	});

	const { error, value } = schema.validate(req.body);

	if (error) {
		throw new ValidationError("Some fields are invalid.", error);
	}

	try {
		const cognitiveTriggerIds = value.cognitiveTriggerIds;

		const cognitiveTriggers =
			await getCognitiveTriggersByIdsService(cognitiveTriggerIds);

		res.status(200).json(cognitiveTriggers);
	} catch (error) {
		next(error);
	}
};

// @desc    Removes cognitive Triggers, receives array (codes) of cognitiveTriggerCodes
// @route   POST
// @access  Private
export const removeCognitiveTriggersController = async (req, res, next) => {
	const requestSchema = Joi.object({
		codes: Joi.array()
			.items(Joi.string().max(80).regex(/^\S+$/))
			.min(1)
			.required(),
	});

	try {
		const { error, value } = requestSchema.validate(req.body);
		if (error) {
			throw new ValidationError("Some fields are invalid.", error);
		}

		await removeCognitiveTriggersService(value.codes);

		res.status(200).json({
			message: "Cognitive Triggers removed successfully!",
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Adds Categories
// @route   POST
// @access  Private
export const addCategoriesController = async (req, res, next) => {
	const categorySchema = Joi.object({
		name: Joi.string().max(50).required(),
		code: Joi.string().max(30).regex(/^\S+$/).required(),
		description: Joi.string().max(1000).optional(),
		color: Joi.string().max(50).optional(),
		image: Joi.string().max(200).optional(),
		isOriginal: Joi.boolean().required(),
	});

	const requestSchema = Joi.array().items(categorySchema).min(1).required();

	try {
		const { error, value } = requestSchema.validate(req.body);
		if (error) {
			throw new ValidationError("Some fields are invalid.", error);
		}

		const newCategories = await addCategoriesService(value, req.user?.id);

		res.status(201).json({
			message: "Categories added successfully!",
			categories: newCategories,
		});
	} catch (error) {
		next(error);
	}
};

// @desc    Gets Categories
// @route   POST
// @access  Public
// example request {
//    "categoryIds": ["64df88c888e5835cf9c0561d", "64df88c888e5835cf9c0561e"]
// }
// example response {
//     "64df88c888e5835cf9c0561d": "Groceries",
//     "64df88c888e5835cf9c0561e": "Rent",
// }
export const getCategoriesByIdsController = async (req, res, next) => {
	const schema = Joi.object({
		categoryIds: Joi.array()
			.items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
			.required(),
	});

	const { error, value } = schema.validate(req.body);

	if (error) {
		throw new ValidationError("Some fields are invalid.", error);
	}

	try {
		const categoryIds = value.categoryIds;

		const categories = await getCategoriesByIdsService(categoryIds);

		res.status(200).json(categories);
	} catch (error) {
		next(error);
	}
};

// @desc    Removes Categories
// @route   POST
// @access  Private
export const removeCategoriesController = async (req, res, next) => {
	const requestSchema = Joi.object({
		codes: Joi.array()
			.items(Joi.string().max(30).regex(/^\S+$/))
			.min(1)
			.required(),
	});

	try {
		const { error, value } = requestSchema.validate(req.body);
		if (error) {
			throw new ValidationError("Some fields are invalid.", error);
		}

		await removeCategoriesService(value.codes);

		res.status(200).json({
			message: "Categories removed successfully!",
		});
	} catch (error) {
		next(error);
	}
};

export const getCognitiveTriggersController = async (req, res, next) => {
	try {
		const cognitiveTriggers = await getCognitiveTriggersService();

		res.status(200).json({ cognitiveTriggers });
	} catch (error) {
		next(error);
	}
};

export const getAllCategoriesController = async (req, res, next) => {
	try {
		const categories = await getAllCategoriesService();

		res.status(200).json({ categories });
	} catch (error) {
		next(error);
	}
};
