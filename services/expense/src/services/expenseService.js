import Expense from "../models/Expense.js";
import mongoose from "mongoose";
import Category from "../models/Category.js";
import CognitiveTrigger from "../models/CognitiveTrigger.js";
import {
	ValidationError,
	publishEvent,
	EVENTS,
	produceEvent,
	TOPICS,
} from "@expensio/sharedlib";
import { logInfo, logWarning, logError } from "@expensio/sharedlib";
import connectRabbitMQ from "../config/rabbitmq.js";
import { connectKafka } from "../config/connectKafka.js";

export const getExpensesService = async (queryParameters, userId) => {
	const {
		start_date,
		end_date,
		search,
		categoryId,
		cognitiveTriggerIds,
		mood,
		eventId,
		page = 1,
		pageSize = 20,
		id, // id supersedes everything else
	} = queryParameters;

	let query = { userId };

	if (id) {
		const expense = await Expense.findOne({ _id: id, userId }).populate(
			"categoryId cognitiveTriggerIds"
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

	if (cognitiveTriggerIds && cognitiveTriggerIds.length > 0) {
		query.cognitiveTriggerIds = { $in: cognitiveTriggerIds };
	}

	if (mood) {
		query.mood = mood;
	}

	const limit = parseInt(pageSize);
	const skip = (parseInt(page) - 1) * limit;

	const expenses = await Expense.find(query)
		.populate("categoryId cognitiveTriggerIds")
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

export const addExpensesService = async (expensesData, userId) => {
	const createdExpenses = [];

	for (const expenseData of expensesData) {
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
			cognitiveTriggerCodes,
		} = expenseData;

		const category = await Category.findOne({ code: categoryCode });
		if (!category) {
			throw new ValidationError("Invalid category code.");
		}

		let cognitiveTriggerIds = [];
		let cognitiveTriggerNames = [];
		if (cognitiveTriggerCodes && cognitiveTriggerCodes.length > 0) {
			const cognitiveTriggers = await CognitiveTrigger.find({
				code: { $in: cognitiveTriggerCodes },
			});
			if (cognitiveTriggers.length !== cognitiveTriggerCodes.length) {
				throw new ValidationError(
					"One or more cognitive trigger codes are invalid."
				);
			}
			cognitiveTriggerIds = cognitiveTriggers.map((trigger) => trigger._id);
			cognitiveTriggerNames = cognitiveTriggers.map((trigger) => trigger.name);
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
			cognitiveTriggerIds:
				cognitiveTriggerIds.length > 0 ? cognitiveTriggerIds : null,
		});

		await newExpense.save();

		createdExpenses.push(newExpense);

		// Publish the event after successfully saving the expense
		// const channel = await connectRabbitMQ();
		// await publishEvent(
		// 	EVENTS.EXPENSE_CREATED,
		// 	{
		// 		...newExpense.toObject(),
		// 		categoryName: category.name,
		// 		cognitiveTriggerNames,
		// 		createdAt: newExpense.createdAt,
		// 	},
		// 	channel
		// );

		const { producerInstance } = await connectKafka();
		await produceEvent(
			EVENTS.EXPENSE_CREATED,
			{
				...newExpense.toObject(),
				categoryName: category.name,
				cognitiveTriggerNames,
				createdAt: newExpense.createdAt,
			},
			TOPICS.EXPENSE,
			producerInstance
		);
	}

	return createdExpenses;
};

export const deleteExpensesByIdsService = async (expenseIds, userId) => {
	if (!Array.isArray(expenseIds) || expenseIds.length === 0) {
		throw new ValidationError("Expense IDs must be a non-empty array.");
	}

	// Validate the expense IDs
	const invalidIds = expenseIds.filter(
		(id) => !mongoose.Types.ObjectId.isValid(id)
	);
	if (invalidIds.length > 0) {
		throw new ValidationError("Invalid expense ID(s) provided.");
	}

	// Find and delete the expenses
	const expensesToDelete = await Expense.find({
		_id: { $in: expenseIds },
		userId: userId,
	});

	// if (expensesToDelete.length === 0) {
	//     throw new ValidationError(
	//         "No expenses found for the given IDs or you do not have permission to delete them."
	//     );
	// }

	const result = await Expense.deleteMany({
		_id: { $in: expenseIds },
		userId: userId,
	});

	// If the deletion was successful, publish the EXPENSES_DELETED event
	if (result.deletedCount > 0) {
		const channel = await connectRabbitMQ();
		await publishEvent(
			EVENTS.EXPENSE_DELETED,
			expensesToDelete, // Sending the array of deleted expenses
			channel
		);
	}

	return result;
};

export const deleteExpensesByUserId = async (userId, retries = 3) => {
	if (!mongoose.Types.ObjectId.isValid(userId)) {
		throw new ValidationError("Invalid user ID provided.");
	}

	try {
		const result = await Expense.deleteMany({ userId: userId }); // Intentional typo

		// if (result.deletedCount === 0) {
		//     throw new ValidationError(
		//         "No expenses found for the given user ID or you do not have permission to delete them."
		//     );
		// }

		logInfo(`Expenses for user with id '${userId}' deleted successfully.`);
		return result;
	} catch (error) {
		if (retries > 0) {
			logWarning(
				`Failed to delete expenses for user ${userId}, retrying... (${retries} retries left)`
			);
			await new Promise((res) => setTimeout(res, 1000)); // Wait 1 second before retrying
			return deleteExpensesByUserId(userId, retries - 1);
		} else {
			logError(
				`Failed to delete expenses for user ${userId} after multiple attempts.`
			);
			throw error; // Propagate the error after all retries are exhausted
		}
	}
};

export const getCategoriesByIdsService = async (categoryIds) => {
	const categories = await Category.find({ _id: { $in: categoryIds } });

	const categoryMap = {};
	categories.forEach((category) => {
		categoryMap[category._id] = category.name;
	});

	return categoryMap;
};

export const getCognitiveTriggersByIdsService = async (cognitiveTriggerIds) => {
	const cognitiveTriggers = await CognitiveTrigger.find({
		_id: { $in: cognitiveTriggerIds },
	});

	const cognitiveTriggerMap = {};
	cognitiveTriggers.forEach((trigger) => {
		cognitiveTriggerMap[trigger._id] = trigger.name;
	});

	return cognitiveTriggerMap;
};

//
//one time use services below.......
// ***********************************
// ***********************************
export const addCognitiveTriggersService = async (cognitiveTriggersData) => {
	const createdCognitiveTriggers = [];

	for (const triggerData of cognitiveTriggersData) {
		const { name, code, description } = triggerData;

		const existingTrigger = await CognitiveTrigger.findOne({ code });
		if (existingTrigger) {
			throw new ValidationError(
				`Cognitive Trigger with code ${code} already exists.`
			);
		}

		const newCognitiveTrigger = new CognitiveTrigger({
			name,
			code,
			description: description || null,
		});

		await newCognitiveTrigger.save();
		createdCognitiveTriggers.push(newCognitiveTrigger);
	}

	return createdCognitiveTriggers;
};

export const removeCognitiveTriggersService = async (cognitiveTriggerCodes) => {
	const result = await CognitiveTrigger.deleteMany({
		code: { $in: cognitiveTriggerCodes },
	});

	if (result.deletedCount === 0) {
		throw new ValidationError(
			"No Cognitive Triggers found with the provided codes."
		);
	}

	return result;
};

export const addCategoriesService = async (categoriesData, userId = null) => {
	const createdCategories = [];

	for (const categoryData of categoriesData) {
		const { name, code, description, color, image, isOriginal } = categoryData;

		const existingCategory = await Category.findOne({ code });
		if (existingCategory) {
			throw new ValidationError(`Category with code ${code} already exists.`);
		}

		const newCategory = new Category({
			name,
			code,
			description: description || null,
			color: color || "blue",
			image: image || "categoryImages/default.png",
			isOriginal,
			addedBy: userId || null,
		});

		await newCategory.save();
		createdCategories.push(newCategory);
	}

	return createdCategories;
};

export const removeCategoriesService = async (categoryCodes) => {
	const result = await Category.deleteMany({ code: { $in: categoryCodes } });

	if (result.deletedCount === 0) {
		throw new ValidationError("No Categories found with the provided codes.");
	}

	return result;
};
