import { logInfo, logError, EVENTS, subscribeEvent } from "@expensio/sharedlib";
import MonthlyFinancialData from "../../models/MonthlyFinancialData.js";

export const subscribeToExpenseCreated = async (channel) => {
	const eventName = EVENTS.EXPENSE_CREATED;
	try {
		await subscribeEvent(
			eventName,
			"financial-data-service-expense-created",
			async ({ data, headers }) => {
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
					logError(`Failed to process expenseCreated event: ${error.message}`);
					throw error; // Ensure the message is sent to DLX in case of error
				}
			},
			channel
		);
	} catch (error) {
		logError(`FAILED TO SUBSCRIBE TO ${eventName}.`);
		logError(error.message);
		throw error;
	}
};
