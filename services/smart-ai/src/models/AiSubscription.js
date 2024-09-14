import mongoose from "mongoose";

const aiSubscriptionSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true, // Subscription names should be unique
	},
	monthlyTokens: {
		type: Number,
		required: true,
	},
});

const AiSubscription = mongoose.model("AiSubscription", aiSubscriptionSchema);

export default AiSubscription;
