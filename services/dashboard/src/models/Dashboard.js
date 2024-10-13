// models/Dashboard.js
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
				// required: true,
			},
			createdAt: {
				type: Date,
				required: true,
			},
		},
	],
	latestIncomes: [
		{
			incomeDetailsId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "IncomeDetails",
				// required: true,
			},
			createdAt: {
				type: Date,
				required: true,
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
		lastUpdated: {
			type: Date,
			default: Date.now,
			required: true,
		},
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
		lastUpdated: {
			type: Date,
			default: Date.now,
			required: true,
		},
	},
	lastUpdated: {
		type: Date,
		default: Date.now,
	},
});

// **Indexing for Performance Optimization**
dashboardSchema.index({ userId: 1 });
dashboardSchema.index({ "latestExpenses.expenseDetailsId": 1 });
dashboardSchema.index({ "latestIncomes.incomeDetailsId": 1 });

const Dashboard = mongoose.model("Dashboard", dashboardSchema);

export default Dashboard;
