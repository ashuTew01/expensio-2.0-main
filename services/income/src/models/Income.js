import mongoose, { Mongoose } from "mongoose";

const incomeSchema = new mongoose.Schema(
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
		incomeType: {
			type: String,
			enum: ["primary", "secondary", "settlement", "unknown"],
			required: true,
			default: "unknown",
		},
		isRecurring: {
			type: Boolean,
			required: true,
			default: false,
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
		image: {
			type: String,
			maxlength: 300,
		},
		deletable: { type: Boolean, required: true, default: true },
	},

	{ timestamps: true }
);

const Income = mongoose.model("Income", incomeSchema);

export default Income;
