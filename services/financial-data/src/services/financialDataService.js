import { logInfo, logError } from "@expensio/sharedlib";
import MonthlyFinancialData from "../models/MonthlyFinancialData.js";

export const addFinancialDataService = async (data) => {
	const {
		title,
		userId,
		amount,
		categoryId,
		cognitiveTriggerIds,
		mood,
		createdAt,
	} = data;
	try {
		const date = new Date(createdAt);
		const year = date.getFullYear();
		const month = date.getMonth() + 1; // Months are 0-indexed in JS
		// Find or create the monthly financial data document for this user and month
		let financialData = await MonthlyFinancialData.findOne({
			userId,
			year,
			month,
		});
		if (!financialData) {
			financialData = new MonthlyFinancialData({
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
		// Update the total money spent and total number of expenses
		financialData.totalMoneySpent += amount;
		financialData.totalExpenses += 1;
		// Update the category information
		const category = financialData.categories.find((c) =>
			c.categoryId.equals(categoryId)
		);
		if (category) {
			category.numExpenses += 1;
			category.totalAmountSpent += amount;
		} else {
			financialData.categories.push({
				categoryId,
				numExpenses: 1,
				totalAmountSpent: amount,
			});
		}
		// Update the cognitive triggers information
		cognitiveTriggerIds.forEach((triggerId) => {
			const trigger = financialData.cognitiveTriggers.find((t) =>
				t.cognitiveTriggerId.equals(triggerId)
			);
			if (trigger) {
				trigger.numExpenses += 1;
				trigger.totalAmountSpent += amount;
			} else {
				financialData.cognitiveTriggers.push({
					cognitiveTriggerId: triggerId,
					numExpenses: 1,
					totalAmountSpent: amount,
				});
			}
		});
		// Update the mood information
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
		// Save the updated financial data
		await financialData.save();
		const monthName = date.toLocaleString("en-US", { month: "long" });
		logInfo(
			`Expense '${title}' added to financial data of user with id '${userId}', for '${monthName} ${year}'.`
		);
	} catch (error) {
		logError(`Failed to process expense. Created event: ${error.message}`);
		throw error; // Ensure the message is sent to DLX in case of error
	}
};

/**
 * Get financial data for a user based on the provided month and year pairs.
 * @param {number} userId - The ID of the user whose financial data is being requested.
 * @param {Array<{month: number, year: number}>} monthYearPairs - An array of objects containing the month and year pairs for which data is required.
 * @returns {Promise<Array>} - Returns an array of financial data objects for the requested months.
 */
export const getFinancialDataService = async (userId, monthYearPairs) => {
	try {
		// Create the query conditions based on the monthYearPairs array
		const conditions = monthYearPairs.map(({ month, year }) => ({
			userId,
			month,
			year,
		}));

		// Query the MonthlyFinancialData collection
		const financialData = await MonthlyFinancialData.find({
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
 * Remove financial data related to deleted expenses for a user.
 * @param {Array<Object>} deletedExpenses - An array of deleted expense objects, each containing details such as userId, amount, categoryId, cognitiveTriggerIds, mood, and createdAt.
 * @returns {Promise<void>} - Returns a promise that resolves when the financial data has been successfully updated or rejects with an error.
 * @throws {Error} - Throws an error if the financial data update fails.
 */
export const removeFinancialDataService = async (deletedExpenses) => {
	try {
		for (const expense of deletedExpenses) {
			const {
				userId,
				title,
				amount,
				categoryId,
				cognitiveTriggerIds,
				mood,
				createdAt,
			} = expense;

			const date = new Date(createdAt);
			const year = date.getFullYear();
			const month = date.getMonth() + 1; // Months are 0-indexed in JS

			// Find the corresponding MonthlyFinancialData record
			const financialData = await MonthlyFinancialData.findOne({
				userId,
				year,
				month,
			});

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

					// Remove the category if it has no expenses left
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

						// Remove the trigger if it has no expenses left
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

					// Remove the mood if it has no expenses left
					if (moodInfo.numExpenses <= 0) {
						financialData.moods.pull({ _id: moodInfo._id });
					}
				}

				// Save the updated financial data
				await financialData.save();
				const monthName = date.toLocaleString("en-US", { month: "long" });
				logInfo(
					`Expense '${title}' for ₹${amount} deleted from Financial Data of User '${userId}', for ${monthName} ${year}`
				);
			}
		}
	} catch (error) {
		logError(`Failed to remove financial data: ${error.message}`);
		throw error;
	}
};
