import Joi from "joi";
import { callOpenaiService } from "../services/openaiService.js";
import { ValidationError } from "@expensio/sharedlib";
import { getUserAiTokensDetailsService } from "../services/aiSubscriptionService.js";

export const callAiController = async (req, res, next) => {
	try {
		const userId = req.user.id;

		const requestSchema = Joi.object({
			conversationHistory: Joi.array().items(Joi.object()).required(),
			functions: Joi.array().items().optional(),
			model: Joi.string().optional(),
		});

		// Validate request body
		const { error, value } = requestSchema.validate(req.body);
		if (error) {
			throw new ValidationError("Some fields are invalid.", error);
		}

		const { conversationHistory, functions, model } = value;

		const aiResponse = await callOpenaiService(
			userId,
			conversationHistory,
			functions ? functions : [],
			model
		);

		res.status(200).json({ aiResponse: aiResponse, message: "OK" });
	} catch (error) {
		next(error);
	}
};

export const getUserAiTokensDetailsController = async (req, res, next) => {
	try {
		const userId = req.user.id;

		const aiUserTokensDocument = await getUserAiTokensDetailsService(userId);

		res.status(200).json({ data: aiUserTokensDocument, message: "OK" });
	} catch (error) {
		next(error);
	}
};
