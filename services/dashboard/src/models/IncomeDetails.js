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
		enum: ["primary", "secondary", "settlement", "unknown"],
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
incomeDetailsSchema.index({ userId: 1, createdAt: -1 });
const IncomeDetails = mongoose.model("IncomeDetails", incomeDetailsSchema);

export default IncomeDetails;
