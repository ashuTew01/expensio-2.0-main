import mongoose from "mongoose";

const monthlyExpensefinancialDataSchema = new mongoose.Schema({
	userId: {
		type: Number,
		required: true,
	},
	year: {
		type: Number,
		required: true,
	},
	month: {
		type: Number, // 1-12 for January-December
		required: true,
	},
	categories: [
		{
			categoryId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Still store the ID for reference
			categoryName: { type: String, default: null }, // Optional field for the category name
			numExpenses: { type: Number, default: 0 },
			totalAmountSpent: { type: Number, default: 0 },
		},
	],
	cognitiveTriggers: [
		{
			cognitiveTriggerId: {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
			}, // Still store the ID for reference
			cognitiveTriggerName: { type: String, default: null }, // Optional field for the cognitive trigger name
			numExpenses: { type: Number, default: 0 },
			totalAmountSpent: { type: Number, default: 0 },
		},
	],
	moods: [
		{
			mood: { type: String, enum: ["happy", "neutral", "regretful"] },
			numExpenses: { type: Number, default: 0 },
			totalAmountSpent: { type: Number, default: 0 },
		},
	],
	totalMoneySpent: { type: Number, default: 0 },
	totalExpenses: { type: Number, default: 0 },
});

const MonthlyExpenseFinancialData = mongoose.model(
	"MonthlyExpenseFinancialData",
	monthlyExpensefinancialDataSchema
);
export default MonthlyExpenseFinancialData;
