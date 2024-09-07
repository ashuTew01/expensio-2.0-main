import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
	userId: {
		type: Number,
		required: true,
		index: true, //index on userId for faster querying
	},
	history: [
		{
			role: {
				type: String,
				enum: ["user", "assistant", "system"],
				required: true,
			},
			content: {
				type: String,
				required: true, //cant be null for openAI
			},
			timestamp: {
				type: Date,
				default: Date.now,
			},
		},
	],
	lastUpdated: {
		type: Date,
		default: Date.now,
		index: true, // index to quickly retrieve recent conversations
	},
});

// Pre-save middleware to update lastUpdated timestamp automatically
conversationSchema.pre("save", function (next) {
	this.lastUpdated = Date.now();
	next();
});

const ConversationHistory = mongoose.model(
	"ConversationHistory",
	conversationSchema
);

export default ConversationHistory;
