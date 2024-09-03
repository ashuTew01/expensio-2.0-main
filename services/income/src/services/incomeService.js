import mongoose from "mongoose";
import Category from "../models/Category.js";
import { ValidationError, publishEvent, EVENTS } from "@expensio/sharedlib";
import { logInfo, logWarning, logError } from "@expensio/sharedlib";
import connectRabbitMQ from "../config/rabbitmq.js";
import Income from "../models/Income.js";

export const getIncomesService = async (queryParameters, userId) => {
	const {
		start_date,
		end_date,
		search,
		categoryId,
		page = 1,
		pageSize = 20,
		id, // id supersedes everything else
	} = queryParameters;

	let query = { userId };

	if (id) {
		const income = await Income.findOne({ _id: id, userId }).populate(
			"categoryId"
		);
		if (!income) {
			throw new ValidationError("Income not found.");
		}
		return { incomes: [income], total: 1, page: 1, pages: 1 };
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
		];
	}

	if (categoryId) {
		query.categoryId = categoryId;
	}

	const limit = parseInt(pageSize);
	const skip = (parseInt(page) - 1) * limit;

	const incomes = await Income.find(query)
		.populate("categoryId")
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit);

	const total = await Income.countDocuments(query);

	return {
		incomes,
		total,
		page: parseInt(page),
		pages: Math.ceil(total / limit),
	};
};

export const addIncomesService = async (incomesData, userId) => {
	const createdIncomes = [];

	for (const incomeData of incomesData) {
		const {
			title,
			amount,
			categoryCode,
			incomeType,
			isRecurring,
			description,
			image,
		} = incomeData;

		const category = await Category.findOne({ code: categoryCode });
		if (!category) {
			throw new ValidationError("Invalid category code.");
		}

		const newIncome = new Income({
			userId,
			title,
			amount,
			categoryId: category._id,
			incomeType,
			isRecurring,
			description: description || null,
			image,
		});

		await newIncome.save();
		createdIncomes.push(newIncome);

		// Publish the event after successfully saving the income
		const channel = await connectRabbitMQ();
		await publishEvent(
			EVENTS.INCOME_CREATED,
			{
				...newIncome.toObject(),
				categoryName: category.name,
				createdAt: newIncome.createdAt,
			},
			channel
		);
	}

	return createdIncomes;
};

export const deleteIncomesByIdsService = async (incomeIds, userId) => {
	if (!Array.isArray(incomeIds) || incomeIds.length === 0) {
		throw new ValidationError("Income IDs must be a non-empty array.");
	}

	// Validate the income IDs
	const invalidIds = incomeIds.filter(
		(id) => !mongoose.Types.ObjectId.isValid(id)
	);
	if (invalidIds.length > 0) {
		throw new ValidationError("Invalid income ID(s) provided.");
	}

	// Find and delete the incomes
	const incomesToDelete = await Income.find({
		_id: { $in: incomeIds },
		userId: userId,
	});

	// if (incomesToDelete.length === 0) {
	//     throw new ValidationError(
	//         "No incomes found for the given IDs or you do not have permission to delete them."
	//     );
	// }

	const result = await Income.deleteMany({
		_id: { $in: incomeIds },
		userId: userId,
	});

	// If the deletion was successful, publish the INCOME_DELETED event
	if (result.deletedCount > 0) {
		const channel = await connectRabbitMQ();
		await publishEvent(
			EVENTS.INCOME_DELETED,
			incomesToDelete, // Sending the array of deleted incomes
			channel
		);
	}

	return result;
};

export const deleteIncomesByUserId = async (userId, retries = 3) => {
	if (!mongoose.Types.ObjectId.isValid(userId)) {
		throw new ValidationError("Invalid user ID provided.");
	}

	try {
		const result = await Income.deleteMany({ userId: userId });

		// if (result.deletedCount === 0) {
		//     throw new ValidationError(
		//         "No incomes found for the given user ID or you do not have permission to delete them."
		//     );
		// }

		logInfo(`Incomes for user with id '${userId}' deleted successfully.`);
		return result;
	} catch (error) {
		if (retries > 0) {
			logWarning(
				`Failed to delete incomes for user ${userId}, retrying... (${retries} retries left)`
			);
			await new Promise((res) => setTimeout(res, 1000)); // Wait 1 second before retrying
			return deleteIncomesByUserId(userId, retries - 1);
		} else {
			logError(
				`Failed to delete incomes for user ${userId} after multiple attempts.`
			);
			throw error; // Propagate the error after all retries are exhausted
		}
	}
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
