import Joi from "joi";
import { ValidationError } from "@expensio/sharedlib";
import {
	addCategoriesService,
	addIncomesService,
	deleteIncomesByIdsService,
	getCategoriesByIdsService,
	getIncomesService,
	removeCategoriesService,
} from "../services/incomeService.js";
import Idempotency from "../models/Idempotency.js";

// @desc    Get user's single/multiple income(s) based on query
// @route   GET
// @access  Private
export const getIncomesController = async (req, res, next) => {
	const querySchema = Joi.object({
		start_date: Joi.date().iso().optional(),
		end_date: Joi.date().iso().optional(),
		search: Joi.string().max(200).optional(),
		categoryId: Joi.string()
			.optional()
			.pattern(/^[0-9a-fA-F]{24}$/),
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

		const incomesData = await getIncomesService(value, userId);

		res.status(200).json(incomesData);
	} catch (error) {
		next(error);
	}
};

// @desc    Create new income(s)
// @route   POST
// @access  Private
export const addIncomesController = async (req, res, next) => {
	const incomeSchema = Joi.object({
		title: Joi.string().max(200).required(),
		description: Joi.string().max(1000).optional(),
		incomeType: Joi.string()
			.valid("primary", "secondary", "settlement", "unknown")
			.required(),
		isRecurring: Joi.boolean().optional(),
		amount: Joi.number().positive().required(),
		categoryCode: Joi.string().required(),
		image: Joi.string().max(300).optional(),
		createdAt: Joi.date().iso().optional(),
	});

	const requestSchema = Joi.array().items(incomeSchema).min(1).required();

	try {
		const userId = req.user.id;
		const idempotencyKey = req.headers["idempotency-key"];

		if (!idempotencyKey) {
			throw new ValidationError("Idempotency Key is Required.");
		}

		const existingEntry = await Idempotency.findOne({ idempotencyKey, userId });

		if (existingEntry) {
			// Return the previously processed response
			return res.status(200).json(existingEntry.response);
		}

		const { error, value } = requestSchema.validate(req.body);
		if (error) {
			throw new ValidationError(error.details[0].message);
		}

		const newIncomes = await addIncomesService(value, userId);

		const response = {
			message: "Incomes added successfully!",
			incomes: newIncomes,
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

// @desc    Deletes incomes, receives array eincomes containing incomeIds
// @route   POST
// @access  Private
export const deleteIncomesController = async (req, res, next) => {
	try {
		const userId = req.user.id;

		const deleteIncomesSchema = Joi.object({
			incomes: Joi.array()
				.items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
				.required(),
		});

		const { error, value } = deleteIncomesSchema.validate(req.body);
		if (error) {
			throw new ValidationError(error.details[0].message);
		}

		const result = await deleteIncomesByIdsService(value.incomes, userId);

		res.status(200).json({
			message: `${result.deletedCount} income(s) deleted successfully!`,
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
			throw new ValidationError(error.details[0].message);
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
		throw new ValidationError(error.details[0].message);
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
			throw new ValidationError(error.details[0].message);
		}

		await removeCategoriesService(value.codes);

		res.status(200).json({
			message: "Categories removed successfully!",
		});
	} catch (error) {
		next(error);
	}
};
