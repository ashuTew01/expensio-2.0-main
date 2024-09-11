import mongoose from "mongoose";

const monthlyIncomefinancialDataSchema = new mongoose.Schema(
	{
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
				numIncomes: { type: Number, default: 0 },
				totalAmountEarned: { type: Number, default: 0 },
			},
		],
		totalMoneyEarned: { type: Number, default: 0 },
		totalIncomes: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

const MonthlyIncomeFinancialData = mongoose.model(
	"MonthlyIncomeFinancialData",
	monthlyIncomefinancialDataSchema
);
export default MonthlyIncomeFinancialData;
