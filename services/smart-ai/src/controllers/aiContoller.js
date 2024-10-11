import Joi from "joi";
import { callOpenaiService } from "../services/openaiService.js";
import { ValidationError } from "@expensio/sharedlib";
import {
	getUserAiTokensDetailsService,
	resetGuestAiTokensService,
} from "../services/aiSubscriptionService.js";

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
export const resetGuestAiTokensController = async (req, res, next) => {
	try {
		let { tokens } = req.query;

		if (!tokens) {
			tokens = 50;
		} else {
			tokens = Number(tokens);

			if (isNaN(tokens) || tokens < 0) {
				return res.status(400).json({
					error: "'tokens' must be a whole number",
				});
			}
		}

		await resetGuestAiTokensService(tokens);

		return res.status(200).json({
			message: `Guest AI tokens successfully reset to ${tokens}`,
		});
	} catch (error) {
		next(error); // Forward error to the error handling middleware
	}
};
