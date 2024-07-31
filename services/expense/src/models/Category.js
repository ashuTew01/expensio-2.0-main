import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			maxlength: 50,
		},
		code: {
			type: String,
			required: true,
			maxlength: 30,
			unique: true,
			validate: {
				validator: function (v) {
					return !/\s/.test(v);
				},
				message: (props) => `${props.value} should not contain spaces`,
			},
		},
		description: {
			type: String,
			maxlength: 1000,
		},
		color: {
			type: String,
			maxlength: 50,
			default: "blue",
			required: true,
		},
		image: {
			type: String,
			maxlength: 200,
			default: "categoryImages/default.png",
		},
		isOriginal: {
			type: Boolean,
			required: true,
		},
		addedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
