import mongoose from "mongoose";

const incomeDetailsSchema = new mongoose.Schema({
	userId: {
		type: Number,
		required: true,
	},
	incomeId: {
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
	description: {
		type: String,
		maxlength: 1000,
	},
	incomeType: {
		type: String,
		enum: ["salary", "bonus", "investment", "other"],
		required: true,
	},
	categoryName: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
	},
});

const IncomeDetails = mongoose.model("IncomeDetails", incomeDetailsSchema);

export default IncomeDetails;
