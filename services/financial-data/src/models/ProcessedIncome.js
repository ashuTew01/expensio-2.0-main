import mongoose from "mongoose";

const processedIncomeSchema = new mongoose.Schema(
	{
		userId: {
			type: Number,
			required: true,
			index: true, // Indexed to speed up querying by userId
		},
		incomeId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			unique: true,
		},
		processedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

// Add a TTL index to automatically remove entries after 30 days
// processedIncomeSchema.index({ processedAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days in seconds

const ProcessedIncome = mongoose.model(
	"ProcessedIncome",
	processedIncomeSchema
);

export default ProcessedIncome;
