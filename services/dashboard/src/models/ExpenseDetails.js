import mongoose from "mongoose";

const expenseDetailsSchema = new mongoose.Schema({
	userId: {
		type: Number,
		required: true,
	},
	expenseId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		unique: true,
	},
	title: {
		type: String,
		required: true,
		maxlength: 200,
	},
	amount: {
		type: Number,
		required: true,
	},
	isRecurring: {
		type: Boolean,
		required: true,
		default: false,
	},
	expenseType: {
		type: String,
		enum: ["necessity", "luxury", "investment", "saving"],
		required: true,
	},
	description: {
		type: String,
		maxlength: 1000,
	},
	categoryName: {
		type: String,
		required: true,
	},
	cognitiveTriggerNames: [
		{
			type: String,
		},
	],
	createdAt: {
		type: Date,
		required: true,
	},
});

const ExpenseDetails = mongoose.model("ExpenseDetails", expenseDetailsSchema);

export default ExpenseDetails;
