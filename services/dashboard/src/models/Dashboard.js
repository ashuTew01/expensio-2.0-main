import mongoose from "mongoose";

const dashboardSchema = new mongoose.Schema({
	userId: {
		type: Number,
		required: true,
		unique: true,
	},
	latestExpenses: [
		{
			expenseDetailsId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "ExpenseDetails",
			},
		},
	],
	latestIncomes: [
		{
			incomeDetailsId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "IncomeDetails",
			},
		},
	],
	currentMonthExpenseFinancialData: {
		year: Number,
		month: Number,
		totalMoneySpent: Number,
		totalExpenses: Number,
		expenseCategories: [
			{
				categoryName: String,
				numExpenses: Number,
				totalAmountSpent: Number,
			},
		],
		cognitiveTriggers: [
			{
				cognitiveTriggerName: String,
				numExpenses: Number,
				totalAmountSpent: Number,
			},
		],
		moods: [
			{
				mood: String,
				numExpenses: Number,
				totalAmountSpent: Number,
			},
		],
	},
	currentMonthIncomeFinancialData: {
		year: Number,
		month: Number,
		totalMoneyEarned: Number,
		totalIncomes: Number,
		incomeCategories: [
			{
				categoryName: String,
				numIncomes: Number,
				totalAmountEarned: Number,
			},
		],
	},
	lastUpdated: {
		type: Date,
		default: Date.now,
	},
});

const Dashboard = mongoose.model("Dashboard", dashboardSchema);

export default Dashboard;
