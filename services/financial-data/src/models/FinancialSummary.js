import mongoose from "mongoose";

// Financial Summary Schema
const financialSummarySchema = new mongoose.Schema(
	{
		userId: {
			type: Number,
			required: true,
			index: true, // Indexed for frequent queries
		},
		timePeriod: {
			type: String,
			enum: ["monthly", "last3months", "last6months"],
			required: true,
		},
		year: {
			type: Number,
			required: function () {
				return this.timePeriod === "monthly"; // Year is required for monthly summaries
			},
		},
		month: {
			type: Number,
			required: function () {
				return this.timePeriod === "monthly"; // Month is required for monthly summaries
			},
		},
		startDate: {
			type: Date,
			required: function () {
				return this.timePeriod !== "monthly"; // Start date required for multi-month summaries
			},
		},
		endDate: {
			type: Date,
			required: function () {
				return this.timePeriod !== "monthly"; // End date required for multi-month summaries
			},
		},
		behavioralInsights: {
			type: String,
			description:
				"Deep, novel analysis of the user's spending behaviors, including complex patterns.",
		},
		personalityInsights: {
			type: String,
			description:
				"Detailed assessment of the user's personality traits as they relate to financial habits.",
		},
		personalizedRecommendations: {
			type: String,
			description:
				"Extremely detailed, personalized advice to improve financial habits.",
		},
		benchmarking: {
			type: String,
			description:
				"Sophisticated comparison of the user's financial data against industry standards.",
		},
		lastComputedAt: {
			type: Date,
			default: Date.now,
			description: "Timestamp of when this summary was last calculated.",
		},
	},
	{ timestamps: true }
); // Automatically manages createdAt and updatedAt fields

const FinancialSummary = mongoose.model(
	"FinancialSummary",
	financialSummarySchema
);

export default FinancialSummary;
