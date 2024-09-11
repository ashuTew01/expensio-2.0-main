import mongoose from "mongoose";
import { logInfo, logError, EVENTS, publishEvent } from "@expensio/sharedlib";
import MonthlyExpenseFinancialData from "../models/MonthlyExpenseFinancialData.js";
import MonthlyIncomeFinancialData from "../models/MonthlyIncomeFinancialData.js";
import connectRabbitMQ from "../config/rabbitmq.js";
import ProcessedExpense from "../models/ProcessedExpense.js";
import ProcessedIncome from "../models/ProcessedIncome.js";

const RETRIES = 3; // Default retries
const TIMEOUT = 30000; // 30 seconds timeout

/**
 * Adds an expense to the financial data for a user.
 * This function ensures idempotency, uses MongoDB transactions, and supports retries and timeouts.
 *
 * @param {Object} data - The expense data to be added.
 * @param {string} data._id - The unique ID of the expense.
 * @param {string} data.title - The title or name of the expense.
 * @param {string} data.userId - The ID of the user who made the expense.
 * @param {number} data.amount - The amount of the expense.
 * @param {string} data.categoryId - The ID of the category the expense belongs to.
 * @param {string} data.categoryName - The name of the category the expense belongs to.
 * @param {Array<string>} data.cognitiveTriggerNames - The names of the cognitive triggers associated with the expense.
 * @param {Array<string>} data.cognitiveTriggerIds - The IDs of the cognitive triggers associated with the expense.
 * @param {string} data.mood - The mood associated with the expense (e.g., "happy", "neutral").
 * @param {string} data.paymentMethod - The payment method used for the expense.
 * @param {string} data.createdAt - The timestamp when the expense was created.
 * @param {number} [retries=3] - The number of retry attempts in case of failure.
 *
 * @throws {Error} Throws an error if the process fails after retries.
 * @returns {Promise<void>} Resolves when the expense is successfully added to the financial data.
 *
 * The function performs the following steps:
 * - Checks if the expense has already been processed (idempotency).
 * - Adds the expense to the user's financial data (monthly aggregation).
 * - Publishes an event with the updated financial data.
 * - Uses a MongoDB transaction to ensure atomicity and rollback in case of failure.
 * - Retries up to a default number of 3 times if any step fails.
 * - Throws an error if the process cannot be completed within the specified retries.
 * - Implements a timeout of 30 seconds to prevent hanging processes.
 *
 * @example
 * const expenseData = {
 *   _id: "12345",
 *   title: "Groceries",
 *   userId: "user123",
 *   amount: 100,
 *   categoryId: "category1",
 *   categoryName: "Food",
 *   cognitiveTriggerNames: ["Sale"],
 *   cognitiveTriggerIds: ["trigger1"],
 *   mood: "happy",
 *   paymentMethod: "credit",
 *   createdAt: "2024-09-11T12:00:00Z",
 * };
 *
 * await addExpenseFinancialDataService(expenseData);
 */
export const addExpenseFinancialDataService = async (
	data,
	retries = RETRIES
) => {
	const session = await mongoose.startSession(); // Start a MongoDB session for transactions
	session.startTransaction(); // Start the transaction

	const {
		_id: expenseId,
		title,
		userId,
		amount,
		categoryId,
		categoryName,
		cognitiveTriggerNames,
		cognitiveTriggerIds,
		mood,
		paymentMethod,
		createdAt,
	} = data;

	try {
		// idempotency
		const alreadyProcessed = await ProcessedExpense.findOne({ expenseId });
		if (alreadyProcessed) {
			logInfo(`Expense with ID '${expenseId}' already processed. Skipping.`);
			return;
		}

		const date = new Date(createdAt);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;

		// Find or create the monthly financial data document for this user and month
		let financialData = await MonthlyExpenseFinancialData.findOne({
			userId,
			year,
			month,
		}).session(session); // Use session for transactions
		if (!financialData) {
			financialData = new MonthlyExpenseFinancialData({
				userId,
				year,
				month,
				categories: [],
				cognitiveTriggers: [],
				moods: [],
				totalMoneySpent: 0,
				totalExpenses: 0,
			});
		}

		// Update financial data
		financialData.totalMoneySpent += amount;
		financialData.totalExpenses += 1;

		// Update category information
		const category = financialData.categories.find((c) =>
			c.categoryId.equals(categoryId)
		);
		if (category) {
			category.numExpenses += 1;
			category.totalAmountSpent += amount;
			category.categoryName = categoryName;
		} else {
			financialData.categories.push({
				categoryId,
				categoryName,
				numExpenses: 1,
				totalAmountSpent: amount,
			});
		}

		// Update cognitive triggers information
		cognitiveTriggerIds?.forEach((triggerId, index) => {
			const triggerName = cognitiveTriggerNames[index];
			const trigger = financialData.cognitiveTriggers.find((t) =>
				t.cognitiveTriggerId.equals(triggerId)
			);

			if (trigger) {
				trigger.numExpenses += 1;
				trigger.totalAmountSpent += amount;
				trigger.cognitiveTriggerName = triggerName;
			} else {
				financialData.cognitiveTriggers.push({
					cognitiveTriggerId: triggerId,
					cognitiveTriggerName: triggerName,
					numExpenses: 1,
					totalAmountSpent: amount,
				});
			}
		});

		// Update mood information
		const moodInfo = financialData.moods.find((m) => m.mood === mood);
		if (moodInfo) {
			moodInfo.numExpenses += 1;
			moodInfo.totalAmountSpent += amount;
		} else {
			financialData.moods.push({
				mood,
				numExpenses: 1,
				totalAmountSpent: amount,
			});
		}

		// Timeout mechanism to abort the process after 30 seconds
		const processWithTimeout = new Promise(async (resolve, reject) => {
			const timeoutId = setTimeout(() => {
				reject(new Error("Processing timeout. Failed to process expense."));
			}, TIMEOUT);

			try {
				// Save financial data
				const savedFinancialData = await financialData.save({ session });

				//save the processed expense to the idempotency collection
				await ProcessedExpense.create([{ userId, expenseId }], { session });

				clearTimeout(timeoutId); // Clear timeout if successful

				// Publish event
				const channel = await connectRabbitMQ();
				await publishEvent(
					EVENTS.FINANCIALDATA_UPDATED_EXPENSE,
					savedFinancialData.toObject(),
					channel
				);

				resolve();
			} catch (err) {
				reject(err);
			}
		});

		await processWithTimeout; // Wait for the processing to finish or timeout

		// Commit the transaction
		await session.commitTransaction();
		session.endSession();

		const monthName = date.toLocaleString("en-US", { month: "long" });
		logInfo(
			`Expense '${title}' added to financial data of user with id '${userId}', for '${monthName} ${year}'.`
		);
	} catch (error) {
		await session.abortTransaction(); // Rollback the transaction in case of error

		logError(
			`Failed to process expense with ID ${expenseId}. Error: ${error.message}`
		);

		if (retries > 0) {
			logInfo(
				`Retrying to process expense ${expenseId} (${RETRIES - retries + 1})...`
			);
			return addExpenseFinancialDataService(data, retries - 1); // Retry the service
		}

		throw error; // After all retries fail, throw the error to be handled by the caller
	} finally {
		session.endSession(); // Ensure session ends
	}
};

/**
 * Get Expense financial data for a user based on the provided month and year pairs.
 * @param {number} userId - The ID of the user whose expense financial data is being requested.
 * @param {Array<{month: number, year: number}>} monthYearPairs - An array of objects containing the month and year pairs for which data is required.
 * @returns {Promise<Array>} - Returns an array of expense financial data objects for the requested months.
 */
export const getExpenseFinancialDataService = async (
	userId,
	monthYearPairs
) => {
	try {
		// Create the query conditions based on the monthYearPairs array
		const conditions = monthYearPairs.map(({ month, year }) => ({
			userId,
			month,
			year,
		}));

		// Query the MonthlyExpenseFinancialData collection
		const financialData = await MonthlyExpenseFinancialData.find({
			$or: conditions,
		}).lean(); // Using lean() to get plain JavaScript objects instead of Mongoose documents

		// Return the structured response
		return financialData.map((data) => ({
			userId: data.userId,
			year: data.year,
			month: data.month,
			totalMoneySpent: data.totalMoneySpent,
			totalExpenses: data.totalExpenses,
			categories: data.categories,
			cognitiveTriggers: data.cognitiveTriggers,
			moods: data.moods,
		}));
	} catch (error) {
		logError(`Failed to retrieve financial data: ${error.message}`);
		throw error;
	}
};

/**
 * Remove expense financial data related to deleted expenses for a user.
 * This function supports retries, timeouts, transactions, and idempotency checks.
 * @param {Array<Object>} deletedExpenses - An array of deleted expense objects.
 * @param {number} [retries=3] - The number of retry attempts in case of failure.
 * @throws {Error} - Throws an error if the financial data update fails after retries.
 * @returns {Promise<void>} - Returns a promise that resolves when the financial data has been successfully updated.
 */
export const removeExpenseFinancialDataService = async (
	deletedExpenses,
	retries = RETRIES
) => {
	const session = await mongoose.startSession();
	session.startTransaction(); // Start the transaction

	try {
		for (const expense of deletedExpenses) {
			const {
				_id: expenseId,
				userId,
				title,
				amount,
				categoryId,
				cognitiveTriggerIds,
				mood,
				createdAt,
			} = expense;

			// Check if expense is present in the ProcessedExpense collection
			const processedExpense = await ProcessedExpense.findOne({ expenseId });
			if (!processedExpense) {
				logInfo(
					`Expense with ID '${expenseId}' not found in ProcessedExpense. Skipping.`
				);
				continue; // Skip this expense if it's not in ProcessedExpense
			}

			const date = new Date(createdAt);
			const year = date.getFullYear();
			const month = date.getMonth() + 1;

			// Find the corresponding MonthlyExpenseFinancialData record
			let financialData = await MonthlyExpenseFinancialData.findOne({
				userId,
				year,
				month,
			}).session(session);

			if (financialData) {
				// Update the total money spent and total number of expenses
				financialData.totalMoneySpent -= amount;
				financialData.totalExpenses -= 1;

				// Update the category information
				const category = financialData.categories.find((c) =>
					c.categoryId.equals(categoryId)
				);
				if (category) {
					category.numExpenses -= 1;
					category.totalAmountSpent -= amount;

					if (category.numExpenses <= 0) {
						financialData.categories.pull({ _id: category._id });
					}
				}

				// Update the cognitive triggers information
				for (const triggerId of cognitiveTriggerIds) {
					const trigger = financialData.cognitiveTriggers.find((t) =>
						t.cognitiveTriggerId.equals(triggerId)
					);
					if (trigger) {
						trigger.numExpenses -= 1;
						trigger.totalAmountSpent -= amount;

						if (trigger.numExpenses <= 0) {
							financialData.cognitiveTriggers.pull({ _id: trigger._id });
						}
					}
				}

				// Update the mood information
				const moodInfo = financialData.moods.find((m) => m.mood === mood);
				if (moodInfo) {
					moodInfo.numExpenses -= 1;
					moodInfo.totalAmountSpent -= amount;

					if (moodInfo.numExpenses <= 0) {
						financialData.moods.pull({ _id: moodInfo._id });
					}
				}

				// Timeout mechanism to abort the process after 30 seconds
				const processWithTimeout = new Promise(async (resolve, reject) => {
					const timeoutId = setTimeout(() => {
						reject(
							new Error(
								"Processing timeout. Failed to process expense deletion."
							)
						);
					}, TIMEOUT);

					try {
						// Save financial data
						const savedFinancialData = await financialData.save({ session });

						// Remove the processed expense from the idempotency collection
						await ProcessedExpense.deleteOne({ expenseId }).session(session);

						clearTimeout(timeoutId);

						// Publish the updated financial data event
						const channel = await connectRabbitMQ();
						await publishEvent(
							EVENTS.FINANCIALDATA_UPDATED_EXPENSE,
							savedFinancialData.toObject(),
							channel
						);
						logInfo(
							`Expense '${title}' deleted from userId ${userId}'s FINANCIAL DATA.`
						);
						resolve();
					} catch (err) {
						reject(err);
					}
				});

				await processWithTimeout;
			}
		}

		await session.commitTransaction();
		session.endSession();
		logInfo("Successfully removed financial data for deleted expenses.");
	} catch (error) {
		await session.abortTransaction();

		logError(`Failed to remove financial data: ${error.message}`);
		if (retries > 0) {
			logInfo(
				`Retrying to remove expense financial data (${RETRIES - retries + 1})...`
			);
			return removeExpenseFinancialDataService(deletedExpenses, retries - 1);
		}

		throw error;
	} finally {
		session.endSession();
	}
};

/**
 * Adds an income to the financial data for a user.
 * This function ensures idempotency, uses MongoDB transactions, and supports retries and timeouts.
 *
 * @param {Object} data - The income data to be added.
 * @param {string} data._id - The unique ID of the income.
 * @param {string} data.title - The title or name of the income.
 * @param {string} data.userId - The ID of the user who received the income.
 * @param {number} data.amount - The amount of the income.
 * @param {string} data.categoryId - The ID of the category the income belongs to.
 * @param {string} data.categoryName - The name of the category the income belongs to.
 * @param {string} data.createdAt - The timestamp when the income was created.
 * @param {number} [retries=3] - The number of retry attempts in case of failure.
 *
 * @throws {Error} Throws an error if the process fails after retries.
 * @returns {Promise<void>} Resolves when the income is successfully added to the financial data.
 *
 * The function performs the following steps:
 * - Checks if the income has already been processed (idempotency).
 * - Adds the income to the user's financial data (monthly aggregation).
 * - Publishes an event with the updated financial data.
 * - Uses a MongoDB transaction to ensure atomicity and rollback in case of failure.
 * - Retries up to a default number of 3 times if any step fails.
 * - Throws an error if the process cannot be completed within the specified retries.
 * - Implements a timeout of 30 seconds to prevent hanging processes.
 */
export const addIncomeFinancialDataService = async (
	data,
	retries = RETRIES
) => {
	const session = await mongoose.startSession(); // Start a MongoDB session for transactions
	session.startTransaction(); // Start the transaction

	const {
		_id: incomeId,
		title,
		userId,
		amount,
		categoryId,
		categoryName,
		createdAt,
	} = data;

	try {
		// idempotency
		const alreadyProcessed = await ProcessedIncome.findOne({ incomeId });
		if (alreadyProcessed) {
			logInfo(`Income with ID '${incomeId}' already processed. Skipping.`);
			return;
		}

		const date = new Date(createdAt);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;

		// Find or create the monthly financial data document for this user and month
		let financialData = await MonthlyIncomeFinancialData.findOne({
			userId,
			year,
			month,
		}).session(session); // Use session for transactions
		if (!financialData) {
			financialData = new MonthlyIncomeFinancialData({
				userId,
				year,
				month,
				categories: [],
				totalMoneyEarned: 0,
				totalIncomes: 0,
			});
		}

		// Update financial data
		financialData.totalMoneyEarned += amount;
		financialData.totalIncomes += 1;

		// Update category information
		const category = financialData.categories.find((c) =>
			c.categoryId.equals(categoryId)
		);
		if (category) {
			category.numIncomes += 1;
			category.totalAmountEarned += amount;
			category.categoryName = categoryName;
		} else {
			financialData.categories.push({
				categoryId,
				categoryName,
				numIncomes: 1,
				totalAmountEarned: amount,
			});
		}

		// Timeout mechanism to abort the process after 30 seconds
		const processWithTimeout = new Promise(async (resolve, reject) => {
			const timeoutId = setTimeout(() => {
				reject(new Error("Processing timeout. Failed to process income."));
			}, TIMEOUT);

			try {
				// Save financial data
				const updatedFinancialData = await financialData.save({ session });

				// Save the processed income to the idempotency collection
				await ProcessedIncome.create([{ userId, incomeId }], { session });

				clearTimeout(timeoutId); // Clear timeout if successful

				// Publish event
				const channel = await connectRabbitMQ();
				await publishEvent(
					EVENTS.FINANCIALDATA_UPDATED_INCOME,
					updatedFinancialData.toObject(),
					channel
				);

				resolve();
			} catch (err) {
				reject(err);
			}
		});

		await processWithTimeout; // Wait for the processing to finish or timeout

		// Commit the transaction
		await session.commitTransaction();
		session.endSession();

		const monthName = date.toLocaleString("en-US", { month: "long" });
		logInfo(
			`Income '${title}' added to income financial data of user with id '${userId}', for '${monthName} ${year}'.`
		);
	} catch (error) {
		await session.abortTransaction(); // Rollback the transaction in case of error

		logError(
			`Failed to process income with ID ${incomeId}. Error: ${error.message}`
		);

		if (retries > 0) {
			logInfo(
				`Retrying to process income ${incomeId} (${RETRIES - retries + 1})...`
			);
			return addIncomeFinancialDataService(data, retries - 1); // Retry the service
		}

		throw error; // After all retries fail, throw the error to be handled by the caller
	} finally {
		session.endSession(); // Ensure session ends
	}
};

/**
 * Get income financial data for a user based on the provided month and year pairs.
 * @param {number} userId - The ID of the user whose income financial data is being requested.
 * @param {Array<{month: number, year: number}>} monthYearPairs - An array of objects containing the month and year pairs for which data is required.
 * @returns {Promise<Array>} - Returns an array of income financial data objects for the requested months.
 */
export const getIncomeFinancialDataService = async (userId, monthYearPairs) => {
	try {
		// Create the query conditions based on the monthYearPairs array
		const conditions = monthYearPairs.map(({ month, year }) => ({
			userId,
			month,
			year,
		}));

		const financialData = await MonthlyIncomeFinancialData.find({
			$or: conditions,
		}).lean(); // Using lean() to get plain JavaScript objects instead of Mongoose documents

		// Return the structured response
		return financialData.map((data) => ({
			userId: data.userId,
			year: data.year,
			month: data.month,
			totalMoneyEarned: data.totalMoneyEarned,
			totalIncomes: data.totalIncomes,
			categories: data.categories,
		}));
	} catch (error) {
		logError(`Failed to retrieve income financial data: ${error.message}`);
		throw error;
	}
};

/**
 * Remove income financial data related to deleted incomes for a user.
 * This function supports retries, timeouts, transactions, and idempotency checks.
 * @param {Array<Object>} deletedIncomes - An array of deleted income objects.
 * @param {number} [retries=3] - The number of retry attempts in case of failure.
 * @throws {Error} - Throws an error if the financial data update fails after retries.
 * @returns {Promise<void>} - Returns a promise that resolves when the financial data has been successfully updated.
 */
export const removeIncomeFinancialDataService = async (
	deletedIncomes,
	retries = RETRIES
) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		for (const income of deletedIncomes) {
			const {
				_id: incomeId,
				userId,
				title,
				amount,
				categoryId,
				createdAt,
			} = income;

			// Check if income is present in the ProcessedIncome collection
			const processedIncome = await ProcessedIncome.findOne({ incomeId });
			if (!processedIncome) {
				logInfo(
					`Income with ID '${incomeId}' not found in ProcessedIncome. Skipping.`
				);
				continue; // Skip this income if it's not in ProcessedIncome
			}

			const date = new Date(createdAt);
			const year = date.getFullYear();
			const month = date.getMonth() + 1;

			// Find the corresponding MonthlyIncomeFinancialData record
			let financialData = await MonthlyIncomeFinancialData.findOne({
				userId,
				year,
				month,
			}).session(session);

			if (financialData) {
				// Update the total money earned and total number of incomes
				financialData.totalMoneyEarned -= amount;
				financialData.totalIncomes -= 1;

				// Update category information
				const category = financialData.categories.find((c) =>
					c.categoryId.equals(categoryId)
				);
				if (category) {
					category.numIncomes -= 1;
					category.totalAmountEarned -= amount;

					if (category.numIncomes <= 0) {
						financialData.categories.pull({ _id: category._id });
					}
				}

				// Timeout mechanism to abort the process after 30 seconds
				const processWithTimeout = new Promise(async (resolve, reject) => {
					const timeoutId = setTimeout(() => {
						reject(
							new Error(
								"Processing timeout. Failed to process income deletion."
							)
						);
					}, TIMEOUT);

					try {
						// Save financial data
						const updatedFinancialData = await financialData.save({ session });

						// Remove the processed income from the idempotency collection
						await ProcessedIncome.deleteOne({ incomeId }).session(session);

						clearTimeout(timeoutId);

						// Publish the updated financial data event
						const channel = await connectRabbitMQ();
						await publishEvent(
							EVENTS.FINANCIALDATA_UPDATED_INCOME,
							updatedFinancialData.toObject(),
							channel
						);

						logInfo(
							`Income '${title}' deleted from userId ${userId}'s FINANCIAL DATA.`
						);

						resolve();
					} catch (err) {
						reject(err);
					}
				});

				await processWithTimeout;
			}
		}

		await session.commitTransaction();
		session.endSession();
		logInfo("Successfully removed financial data for deleted incomes.");
	} catch (error) {
		await session.abortTransaction();

		logError(`Failed to remove income financial data: ${error.message}`);
		if (retries > 0) {
			logInfo(
				`Retrying to remove income financial data (${RETRIES - retries + 1})...`
			);
			return removeIncomeFinancialDataService(deletedIncomes, retries - 1);
		}

		throw error;
	} finally {
		session.endSession();
	}
};
