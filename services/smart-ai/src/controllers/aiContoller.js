import Joi from "joi";
import { callOpenaiService } from "../services/openaiService.js";
import { ValidationError } from "@expensio/sharedlib";

export const callAiController = async (req, res, next) => {
	try {
		const userId = req.user.id;

		const requestSchema = Joi.object({
			conversationHistory: Joi.array().items(Joi.string()).required(),
			functions: Joi.array().items(Joi.string()).optional(),
			model: Joi.string().optional(),
		});

		// Validate request body
		const { error, value } = requestSchema.validate(req.body);
		if (error) {
			throw new ValidationError(error.details[0].message);
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
