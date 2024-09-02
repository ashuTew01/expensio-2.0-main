import { logError, logWarning } from "@expensio/sharedlib";
import Dashboard from "../models/Dashboard.js";
import ExpenseDetails from "../models/ExpenseDetails.js";
import IncomeDetails from "../models/IncomeDetails.js";

/**
 * Adds a newly created expense to the user's dashboard.
 * The expense is added to the top of the list, and if the list exceeds 10 items, the oldest expense is removed.
 *
 * @param {Object} expenseData - The data of the created expense.
 * @param {mongoose.Types.ObjectId} expenseData._id - The ID of the expense.
 * @param {Number} expenseData.userId - The ID of the user.
 * @param {String} expenseData.title - The title of the expense.
 * @param {Number} expenseData.amount - The amount spent.
 * @param {Boolean} expenseData.isRecurring - Whether the expense is recurring.
 * @param {String} expenseData.expenseType - The type of the expense.
 * @param {String} [expenseData.description] - The description of the expense.
 * @param {String} expenseData.categoryName - The name of the category.
 * @param {Array<String>} expenseData.cognitiveTriggerNames - The names of the cognitive triggers associated with the expense.
 * @param {Date} expenseData.createdAt - The date and time when the expense was created.
 *
 * @returns {Promise<void>} - Returns a promise that resolves when the dashboard has been updated.
 *
 * @throws {Error} - Throws an error if the dashboard update fails.
 */
export const addExpenseToDashboardService = async (expenseData) => {
	try {
		const { userId, ...expenseDetails } = expenseData;

		// Create a new ExpenseDetails document
		const newExpenseDetails = new ExpenseDetails({
			userId,
			expenseId: expenseData._id,
			title: expenseData.title,
			amount: expenseData.amount,
			isRecurring: expenseData.isRecurring,
			expenseType: expenseData.expenseType,
			description: expenseData.description,
			categoryName: expenseData.categoryName,
			cognitiveTriggerNames: expenseData.cognitiveTriggerNames,
			createdAt: expenseData.createdAt,
		});

		const savedExpenseDetails = await newExpenseDetails.save();

		let dashboard = await Dashboard.findOne({ userId });

		if (!dashboard) {
			dashboard = new Dashboard({
				userId,
				latestExpenses: [],
				latestIncomes: [],
				currentMonthFinancialData: {},
				lastUpdated: new Date(),
			});
		}

		// Add the new expenseDetailsId at the top of the list
		dashboard.latestExpenses.unshift({
			expenseDetailsId: savedExpenseDetails._id,
		});

		// Ensure only the latest 10 expenses are kept
		if (dashboard.latestExpenses.length > 10) {
			dashboard.latestExpenses.pop();
		}

		// Update the lastUpdated field
		dashboard.lastUpdated = new Date();

		// Save the updated dashboard
		await dashboard.save();
	} catch (error) {
		logError(`Failed to add expense to dashboard: ${error.message}`);
		throw error;
	}
};

/**
 * Removes expenses from the user's dashboard based on the array of deleted expenses.
 * If any of the expenses are found in the latest expenses list, they are removed, and the dashboard is updated.
 *
 * @param {Array<Object>} expenses - The array of deleted expenses.
 * @param {Number} userId - The ID of the user whose dashboard is being updated.
 *
 * @returns {Promise<void>} - Returns a promise that resolves when the dashboard has been updated.
 *
 * @throws {Error} - Throws an error if the dashboard update fails.
 */
export const removeExpensesFromDashboardService = async (expenses, userId) => {
	try {
		// Find the user's dashboard
		const dashboard = await Dashboard.findOne({ userId });

		if (!dashboard) {
			logError("Dashboard not found for the user.");
			throw new Error("Dashboard not found for the user.");
		}

		// Extract the expense IDs from the deleted expenses array
		const expenseIds = expenses.map((expense) => expense._id.toString());

		// Find all ExpenseDetails documents that match the expense IDs
		const expenseDetailsToRemove = await ExpenseDetails.find({
			expenseId: { $in: expenseIds },
		});

		// Extract the expenseDetailsIds to remove from the dashboard
		const expenseDetailsIdsToRemove = expenseDetailsToRemove.map(
			(expenseDetail) => expenseDetail._id
		);

		// Filter out the expenseDetailsIds from the dashboard's latest expenses
		dashboard.latestExpenses = dashboard.latestExpenses.filter(
			(expense) => !expenseDetailsIdsToRemove.includes(expense.expenseId)
		);

		// Save the updated dashboard
		await dashboard.save();

		// Delete the ExpenseDetails documents as they're no longer needed
		await ExpenseDetails.deleteMany({ expenseId: { $in: expenseIds } });
	} catch (error) {
		logError(`Failed to remove expenses from dashboard: ${error.message}`);
		throw error;
	}
};

/**
 * Adds a newly created income to the user's dashboard.
 * The income is added to the top of the list, and if the list exceeds 10 items, the oldest income is removed.
 *
 * @param {Object} incomeData - The data of the created income.
 * @param {mongoose.Types.ObjectId} incomeData._id - The ID of the income.
 * @param {Number} incomeData.userId - The ID of the user.
 * @param {String} incomeData.title - The title of the income.
 * @param {Number} incomeData.amount - The amount earned.
 * @param {String} incomeData.incomeType - The type of the income.
 * @param {String} [incomeData.description] - The description of the income.
 * @param {String} incomeData.categoryName - The name of the category.
 * @param {Date} incomeData.createdAt - The date and time when the income was created.
 *
 * @returns {Promise<void>} - Returns a promise that resolves when the dashboard has been updated.
 *
 * @throws {Error} - Throws an error if the dashboard update fails.
 */
export const addIncomeToDashboardService = async (incomeData) => {
	try {
		const { userId, ...incomeDetails } = incomeData;

		const newIncomeDetails = new IncomeDetails({
			userId,
			incomeDetailsId: incomeData._id, // Reference to the original income ID
			title: incomeData.title,
			amount: incomeData.amount,
			incomeType: incomeData.incomeType,
			description: incomeData.description,
			categoryName: incomeData.categoryName,
			createdAt: incomeData.createdAt,
		});

		const savedIncomeDetails = await newIncomeDetails.save();

		let dashboard = await Dashboard.findOne({ userId });

		if (!dashboard) {
			dashboard = new Dashboard({
				userId,
				latestExpenses: [],
				latestIncomes: [],
				currentMonthFinancialData: {},
				lastUpdated: new Date(),
			});
		}

		// Add the new incomeDetailsId at the top of the list
		dashboard.latestIncomes.unshift({
			incomeDetailsId: savedIncomeDetails._id,
		});

		// Ensure only the latest 10 incomes are kept
		if (dashboard.latestIncomes.length > 10) {
			dashboard.latestIncomes.pop();
		}

		// Update the lastUpdated field
		dashboard.lastUpdated = new Date();

		// Save the updated dashboard
		await dashboard.save();
	} catch (error) {
		logError(`Failed to add income to dashboard: ${error.message}`);
		throw error;
	}
};

/**
 * Removes incomes from the user's dashboard based on the array of deleted incomes.
 * If any of the incomes are found in the latest incomes list, they are removed, and the dashboard is updated.
 *
 * @param {Array<Object>} incomes - The array of deleted incomes.
 * @param {Number} userId - The ID of the user whose dashboard is being updated.
 *
 * @returns {Promise<void>} - Returns a promise that resolves when the dashboard has been updated.
 *
 * @throws {Error} - Throws an error if the dashboard update fails.
 */
export const removeIncomesFromDashboardService = async (incomes, userId) => {
	try {
		// Find the user's dashboard
		const dashboard = await Dashboard.findOne({ userId });

		if (!dashboard) {
			logError("Dashboard not found for the user.");
			throw new Error("Dashboard not found for the user.");
		}

		// Extract the income IDs from the deleted incomes array
		const incomeIds = incomes.map((income) => income._id.toString());

		// Find all IncomeDetails documents that match the income IDs
		const incomeDetailsToRemove = await IncomeDetails.find({
			incomeId: { $in: incomeIds },
		});

		// Extract the incomeDetailsIds to remove from the dashboard
		const incomeDetailsIdsToRemove = incomeDetailsToRemove.map(
			(incomeDetail) => incomeDetail._id
		);

		// Filter out the incomeDetailsIds from the dashboard's latest incomes
		dashboard.latestIncomes = dashboard.latestIncomes.filter(
			(income) => !incomeDetailsIdsToRemove.includes(income.incomeId)
		);

		// Save the updated dashboard
		await dashboard.save();

		// Delete the IncomeDetails documents as they're no longer needed
		await IncomeDetails.deleteMany({ incomeId: { $in: incomeIds } });
	} catch (error) {
		logError(`Failed to remove incomes from dashboard: ${error.message}`);
		throw error;
	}
};

/**
 * Updates the dashboard's expense financial data based on the updated expense financial data event.
 *
 * @param {Object} financialData - The updated financial data object received from the event.
 * @param {number} financialData.userId - The ID of the user whose dashboard is being updated.
 * @param {number} financialData.year - The year of the financial data being updated.
 * @param {number} financialData.month - The month of the financial data being updated.
 * @param {Array<Object>} financialData.categories - The categories with their IDs, number of expenses, and total amount spent.
 * @param {Array<Object>} financialData.cognitiveTriggers - The cognitive triggers with their IDs, number of expenses, and total amount spent.
 * @param {number} financialData.totalMoneySpent - The total money spent by the user in the given month.
 * @param {number} financialData.totalExpenses - The total number of expenses in the given month.
 *
 * @throws Will throw an error if the financial data cannot be updated.
 */
export const updateExpenseFinancialDataService = async (financialData) => {
	try {
		const {
			userId,
			year,
			month,
			categories,
			cognitiveTriggers,
			totalMoneySpent,
			totalExpenses,
		} = financialData;

		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed in JS

		// If the financial data is not for the current month, ignore it
		if (year !== currentYear || month !== currentMonth) {
			logInfo(
				`Expense financial data for ${month}-${year} is not current month data. Ignoring update.`
			);
			return;
		}

		// Fetch category names and cognitive trigger names
		const categoryIds = categories.map((category) => category.categoryId);
		const cognitiveTriggerIds = cognitiveTriggers.map(
			(trigger) => trigger.cognitiveTriggerId
		);

		const [categoryResponse, cognitiveTriggerResponse] = await Promise.all([
			axios.post(`${process.env.EXPENSE_SERVICE_URL}/category/get`, {
				categoryIds,
			}),
			axios.post(`${process.env.EXPENSE_SERVICE_URL}/cognitive-trigger/get`, {
				cognitiveTriggerIds,
			}),
		]);

		const categoryMap = categoryResponse.data;
		const cognitiveTriggerMap = cognitiveTriggerResponse.data;

		// Find or create the dashboard document for this user
		let dashboard = await Dashboard.findOne({ userId });

		if (!dashboard) {
			dashboard = new Dashboard({
				userId,
				latestExpenses: [],
				latestIncomes: [],
				currentMonthExpenseFinancialData: {},
				currentMonthIncomeFinancialData: {},
			});
		}

		// Update the current month's expense financial data in the dashboard
		dashboard.currentMonthExpenseFinancialData = {
			year,
			month,
			totalMoneySpent,
			totalExpenses,
			expenseCategories: categories.map((category) => ({
				categoryName: categoryMap[category.categoryId],
				numExpenses: category.numExpenses,
				totalAmountSpent: category.totalAmountSpent,
			})),
			cognitiveTriggers: cognitiveTriggers.map((trigger) => ({
				cognitiveTriggerName: cognitiveTriggerMap[trigger.cognitiveTriggerId],
				numExpenses: trigger.numExpenses,
				totalAmountSpent: trigger.totalAmountSpent,
			})),
		};

		await dashboard.save();

		logInfo(
			`Dashboard expense financial data updated for user ${userId} for ${currentMonth} ${currentYear}.`
		);
	} catch (error) {
		logError(
			`Failed to update dashboard expense financial data: ${error.message}`
		);
		throw error;
	}
};

/**
 * Updates the dashboard's income financial data based on the updated income financial data event.
 *
 * @param {Object} financialData - The updated financial data object received from the event.
 * @param {number} financialData.userId - The ID of the user whose dashboard is being updated.
 * @param {number} financialData.year - The year of the financial data being updated.
 * @param {number} financialData.month - The month of the financial data being updated.
 * @param {Array<Object>} financialData.categories - The income categories with their IDs, number of incomes, and total amount earned.
 * @param {number} financialData.totalMoneyEarned - The total money earned by the user in the given month.
 * @param {number} financialData.totalIncomes - The total number of incomes in the given month.
 *
 * @throws Will throw an error if the financial data cannot be updated.
 */
export const updateIncomeFinancialDataService = async (financialData) => {
	try {
		const { userId, year, month, categories, totalMoneyEarned, totalIncomes } =
			financialData;

		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed in JS

		// If the financial data is not for the current month, ignore it
		if (year !== currentYear || month !== currentMonth) {
			logInfo(
				`Income financial data for ${month}-${year} is not current month data. Ignoring update.`
			);
			return;
		}

		// Fetch category names for the income categories
		const categoryIds = categories.map((category) => category.categoryId);

		const categoryResponse = await axios.post(
			`${process.env.INCOME_SERVICE_URL}/category/get`,
			{ categoryIds }
		);

		const categoryMap = categoryResponse.data;

		// Find or create the dashboard document for this user
		let dashboard = await Dashboard.findOne({ userId });

		if (!dashboard) {
			dashboard = new Dashboard({
				userId,
				latestExpenses: [],
				latestIncomes: [],
				currentMonthExpenseFinancialData: {},
				currentMonthIncomeFinancialData: {},
			});
		}

		// Update the current month's income financial data in the dashboard
		dashboard.currentMonthIncomeFinancialData = {
			year,
			month,
			totalMoneyEarned,
			totalIncomes,
			incomeCategories: categories.map((category) => ({
				categoryName: categoryMap[category.categoryId],
				numIncomes: category.numIncomes,
				totalAmountEarned: category.totalAmountEarned,
			})),
		};

		await dashboard.save();

		logInfo(
			`Dashboard income financial data updated for user ${userId} for ${currentMonth} ${currentYear}.`
		);
	} catch (error) {
		logError(
			`Failed to update dashboard income financial data: ${error.message}`
		);
		throw error;
	}
};

/**
 * Fetches the dashboard data for a specific user.
 *
 * @param {number} userId - The ID of the user whose dashboard data is being retrieved.
 * @returns {Promise<Object>} - The dashboard data for the user.
 * @throws Will throw an error if the dashboard data cannot be retrieved.
 */
export const getDashboardService = async (userId) => {
	try {
		const dashboard = await Dashboard.findOne({ userId })
			.populate({
				path: "latestExpenses.expenseDetailsId",
				model: "ExpenseDetails",
			})
			.populate({
				path: "latestIncomes.incomeDetailsId",
				model: "IncomeDetails",
			})
			.exec();

		if (!dashboard) {
			return {
				message:
					"Dashboard not found. Please add some expenses and incomes to generate your dashboard.",
			};
		}

		return dashboard;
	} catch (error) {
		throw new Error(`Failed to retrieve dashboard: ${error.message}`);
	}
};
