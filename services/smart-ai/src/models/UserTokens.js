import mongoose from "mongoose";

// 1 dollar = 1000 tokens
export const oneDollarToTokens = 1000;

const userTokensSchema = new mongoose.Schema({
	userId: {
		type: Number,
		required: true,
		index: true, // as it will be heavily queried on
	},
	currentTokens: {
		type: Number,
		required: true,
		default: 0,
	},
	aiSubscriptionId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "AiSubscription",
		required: true,
	},
	lastRefillDate: {
		type: Date,
		required: true, // for monthly reset
		default: Date.now,
	},
});

const UserTokens = mongoose.model("UserTokens", userTokensSchema);

export default UserTokens;
