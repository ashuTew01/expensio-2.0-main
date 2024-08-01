import Expense from "../models/Expense.js";
import Category from "../models/Category.js";
import CognitiveTrigger from "../models/CognitiveTrigger.js";
import { ValidationError } from "@expensio/sharedlib";

export const getExpensesService = async (queryParameters, userId) => {
	const {
		start_date,
		end_date,
		search,
		categoryId,
		cognitiveTriggerId,
		mood,
		eventId,
		page = 1,
		pageSize = 20,
		id, //id supersedes everything else
	} = queryParameters;

	let query = { userId };

	if (id) {
		const expense = await Expense.findOne({ _id: id, userId }).populate(
			"categoryId cognitiveTriggerId"
		);
		if (!expense) {
			throw new ValidationError("Expense not found.");
		}
		return { expenses: [expense], total: 1, page: 1, pages: 1 };
	}

	if (start_date || end_date) {
		query.createdAt = {};
		if (start_date) {
			query.createdAt.$gte = new Date(start_date);
		}
		if (end_date) {
			query.createdAt.$lte = new Date(end_date);
		}
	}

	if (search) {
		query.$or = [
			{ title: { $regex: search, $options: "i" } },
			{ description: { $regex: search, $options: "i" } },
			{ notes: { $regex: search, $options: "i" } },
		];
	}
	if (eventId) {
		query.eventId = eventId;
	}

	if (categoryId) {
		query.categoryId = categoryId;
	}

	if (cognitiveTriggerId) {
		query.cognitiveTriggerId = cognitiveTriggerId;
	}

	if (mood) {
		query.mood = mood;
	}

	const limit = parseInt(pageSize);
	const skip = (parseInt(page) - 1) * limit;

	const expenses = await Expense.find(query)
		.populate("categoryId cognitiveTriggerId")
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit);

	const total = await Expense.countDocuments(query);

	return {
		expenses,
		total,
		page: parseInt(page),
		pages: Math.ceil(total / limit),
	};
};

export const createExpenseService = async (expenseData, userId) => {
	const {
		title,
		amount,
		categoryCode,
		expenseType,
		isRecurring,
		description,
		notes,
		image,
		paymentMethod,
		mood,
		eventId,
		cognitiveTriggerCode,
	} = expenseData;

	const category = await Category.findOne({ code: categoryCode });
	if (!category) {
		throw new ValidationError("Invalid category code.");
	}

	let cognitiveTriggerId = null;
	if (cognitiveTriggerCode) {
		const cognitiveTrigger = await CognitiveTrigger.findOne({
			code: cognitiveTriggerCode,
		});
		if (!cognitiveTrigger) {
			throw new ValidationError("Invalid cognitive trigger code.");
		}
		cognitiveTriggerId = cognitiveTrigger._id;
	}

	const newExpense = new Expense({
		userId,
		title,
		amount,
		categoryId: category._id,
		expenseType,
		isRecurring,
		description: description || null,
		notes,
		image,
		paymentMethod,
		mood: mood || "neutral",
		eventId: eventId || null,
		cognitiveTriggerId: cognitiveTriggerId || null,
	});

	await newExpense.save();

	return newExpense;
};

export const deleteExpensesByIdsService = async (expenseIds, userId) => {
	if (!Array.isArray(expenseIds) || expenseIds.length === 0) {
		throw new ValidationError("Expense IDs must be a non-empty array.");
	}

	const invalidIds = expenseIds.filter(
		(id) => !mongoose.Types.ObjectId.isValid(id)
	);
	if (invalidIds.length > 0) {
		throw new ValidationError("Invalid expense ID(s) provided.");
	}

	const result = await Expense.deleteMany({
		_id: { $in: expenseIds },
		userId: userId,
	});

	if (result.deletedCount === 0) {
		throw new ValidationError(
			"No expenses found for the given IDs or you do not have permission to delete them."
		);
	}

	return result;
};
