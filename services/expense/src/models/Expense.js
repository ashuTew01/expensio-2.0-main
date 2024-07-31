import mongoose, { Mongoose } from "mongoose";

const expenseSchema = new mongoose.Schema(
	{
		userId: {
			type: Number,
			required: true,
		},
		title: {
			type: String,
			required: true,
			maxlength: 200,
		},
		description: {
			type: String,
			maxlength: 1000,
		},
		expenseType: {
			type: String,
			enum: ["necessity", "luxury", "investment", "saving"],
			required: true,
		},
		isRecurring: {
			type: Boolean,
			required: true,
			default: false,
		},
		notes: {
			type: [String],
			validate: [
				(array) => array.length <= 10,
				"Array of notes should not exceed 10 elements",
			],
			of: {
				type: String,
				maxlength: 300,
			},
		},
		amount: {
			type: Number,
			required: true,
			validate: {
				validator: function (value) {
					return value > 0;
				},
				message: "Amount must be greater than zero",
			},
		},
		categoryId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		cognitiveTriggerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "CognitiveTrigger",
		},
		image: {
			type: String,
			maxlength: 300,
		},
		paymentMethod: {
			type: String,
			enum: ["cash", "credit_card", "debit_card", "online_payment", "unknown"],
			required: true,
			default: "unknown",
		},
		mood: {
			type: String,
			enum: ["happy", "neutral", "regretful"],
			required: true,
			default: "neutral",
		},
	},
	{ timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
