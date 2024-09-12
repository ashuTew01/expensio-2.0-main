import Expense from "../models/Expense.js";
import mongoose from "mongoose";
import Category from "../models/Category.js";
import CognitiveTrigger from "../models/CognitiveTrigger.js";
import {
	ValidationError,
	EVENTS,
	produceEvent,
	TOPICS,
} from "@expensio/sharedlib";
import { logInfo, logWarning, logError } from "@expensio/sharedlib";
import { connectKafka } from "../config/connectKafka.js";

export const getExpensesService = async (queryParameters, userId) => {
	const {
		start_date,
		end_date,
		search,
		categoryId,
		cognitiveTriggerIds,
		categoryCode,
		cognitiveTriggerCodes,
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

	// Fetch categoryID is categoryCode is provided
	if (!categoryId && categoryCode) {
		const category = await Category.find({ code: categoryCode });
		if (category) query.categoryId = category._id;
	}

	// Fetch cognitiveTriggerIds based on cognitiveTriggerCodes if provided
	if (cognitiveTriggerCodes && cognitiveTriggerCodes.length > 0) {
		const cognitiveTriggers = await CognitiveTrigger.find({
			code: { $in: cognitiveTriggerCodes },
		});
		if (cognitiveTriggers && cognitiveTriggers.length > 0) {
			query.cognitiveTriggerIds = cognitiveTriggers.map(
				(trigger) => trigger._id
			); // Assign fetched cognitiveTriggerIds
		}
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

export const addExpensesService = async (expensesData, userId, retries = 3) => {
	const session = await mongoose.startSession(); // Start a session for transactions
	session.startTransaction(); // Begin a transaction
	const createdExpenses = [];

	try {
		// Timeout mechanism to abort the process after 30 seconds
		const processWithTimeout = new Promise(async (resolve, reject) => {
			const timeoutId = setTimeout(() => {
				reject(new Error("Processing timeout. Failed to process expenses."));
			}, 30000); // 30 seconds timeout

			try {
				// Process each expense in the expensesData array
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

					// Validate the category
					const category = await Category.findOne({
						code: categoryCode,
					}).session(session);
					if (!category) {
						throw new ValidationError("Invalid category code.");
					}

					// Fetch cognitive triggers
					let cognitiveTriggerIds = [];
					let cognitiveTriggerNames = [];
					if (cognitiveTriggerCodes && cognitiveTriggerCodes.length > 0) {
						const cognitiveTriggers = await CognitiveTrigger.find({
							code: { $in: cognitiveTriggerCodes },
						}).session(session);

						if (cognitiveTriggers.length !== cognitiveTriggerCodes.length) {
							throw new ValidationError(
								"One or more cognitive trigger codes are invalid."
							);
						}

						cognitiveTriggerIds = cognitiveTriggers.map(
							(trigger) => trigger._id
						);
						cognitiveTriggerNames = cognitiveTriggers.map(
							(trigger) => trigger.name
						);
					}

					// Create a new expense
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

					await newExpense.save({ session });
					createdExpenses.push(newExpense);

					// Publish the expense created event to Kafka
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

				clearTimeout(timeoutId); // Clear the timeout if everything is processed successfully
				resolve();
			} catch (error) {
				reject(error);
			}
		});

		// Wait for the process to complete or timeout
		await processWithTimeout;

		// Commit the transaction if everything is successful
		await session.commitTransaction();
		session.endSession();

		return createdExpenses;
	} catch (error) {
		// Rollback the transaction on failure
		await session.abortTransaction();
		session.endSession();

		logError(`Failed to process expenses: ${error.message}`);

		// Retry mechanism
		if (retries > 0) {
			logInfo(`Retrying to process expenses (${3 - retries + 1})...`);
			return addExpensesService(expensesData, userId, retries - 1);
		}

		throw error; // After all retries fail, throw the error to the caller
	} finally {
		session.endSession(); // Ensure the session ends
	}
};

export const deleteExpensesByIdsService = async (
	expenseIds,
	userId,
	retries = 3
) => {
	// Start a session for the transaction
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
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

		// Find the expenses to delete
		const expensesToDelete = await Expense.find({
			_id: { $in: expenseIds },
			userId: userId,
		}).session(session); // Use session for transaction

		// Delete the expenses
		const result = await Expense.deleteMany({
			_id: { $in: expenseIds },
			userId: userId,
		}).session(session); // Use session for transaction

		// If deletion was successful, publish the event
		if (result.deletedCount > 0) {
			// Timeout mechanism to abort the process after 30 seconds
			const processWithTimeout = new Promise(async (resolve, reject) => {
				const timeoutId = setTimeout(() => {
					reject(new Error("Processing timeout. Failed to delete expenses."));
				}, 30000); // 30 seconds timeout

				try {
					// Produce the EXPENSE_DELETED event
					const { producerInstance } = await connectKafka();
					await produceEvent(
						EVENTS.EXPENSE_DELETED,
						expensesToDelete,
						TOPICS.EXPENSE,
						producerInstance
					);

					clearTimeout(timeoutId); // Clear timeout if successful
					resolve();
				} catch (err) {
					reject(err);
				}
			});

			await processWithTimeout; // Wait for the process to finish or timeout

			// Commit the transaction
			await session.commitTransaction();
			session.endSession();

			logInfo(
				`Successfully deleted expenses and published the event for user ${userId}.`
			);
		}

		return result;
	} catch (error) {
		// Rollback the transaction on failure
		await session.abortTransaction();
		session.endSession();

		logError(`Failed to delete expenses: ${error.message}`);

		// Retry mechanism
		if (retries > 0) {
			logInfo(`Retrying to delete expenses (${3 - retries + 1})...`);
			return deleteExpensesByIdsService(expenseIds, userId, retries - 1);
		}

		throw error; // After all retries fail, throw the error to the caller
	} finally {
		session.endSession(); // Ensure the session ends
	}
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

export const getCognitiveTriggersService = async () => {
	const cognitiveTriggers = await CognitiveTrigger.find({});
	return cognitiveTriggers;
};

export const getAllCategoriesService = async () => {
	const categories = await Category.find({});
	return categories;
};
