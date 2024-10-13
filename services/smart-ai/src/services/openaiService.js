import { logError, logInfo } from "@expensio/sharedlib";
import { connectOpenai } from "../config/connectOpenai.js";
import UserTokens from "../models/UserTokens.js"; // Import UserTokens model
import mongoose from "mongoose"; // For transactions
import { validModels } from "../utils/openaiApiModels.js";
import { calculateAiTokens } from "../utils/calculateAiTokens.js";

import config from "../config/config.js";

//****************************** WARNING:: DONT REMOVE ********************************************************************* */
import AiSubscription from "../models/AiSubscription.js"; //DONT REMOVE, POPULATE WILL BREAK! Code will not immediately break, but will break next month.
import { assignSubscriptionToUser } from "./aiSubscriptionService.js";
//***************************************************************************************************** */

const validRoles = ["user"];

const MIN_TOKENS_REQUIRED = config.MIN_TOKENS_REQUIRED_FOR_AI_API_CALL;

/**
 * Resets tokens for the new month by adding the subscription's monthly tokens to the user's current tokens.
 * @param {Object} userTokens - The user's token document.
 * @returns {Object} - Updated userTokens object.
 */
const resetTokensIfNewMonth = async (userTokens, session) => {
	const currentDate = new Date();
	const lastRefillDate = new Date(userTokens.lastRefillDate);

	// Check if it's a new month
	if (
		currentDate.getMonth() !== lastRefillDate.getMonth() ||
		currentDate.getFullYear() !== lastRefillDate.getFullYear()
	) {
		// Add the subscription's monthly tokens to the current tokens
		userTokens.currentTokens += userTokens.aiSubscriptionId.monthlyTokens;
		userTokens.lastRefillDate = currentDate;

		await userTokens.save({ session }); // Save the updated tokens
	}
	return userTokens;
};

/**
 * Checks if the user has enough tokens to make the API call.
 * @param {Object} userTokens - The user's token document.
 * @throws {Error} - If the user doesn't have enough tokens.
 */
const checkTokenAvailability = (userTokens) => {
	if (userTokens.currentTokens < MIN_TOKENS_REQUIRED) {
		throw new Error(
			`Your AI tokens are insufficient. You have ${userTokens.currentTokens.toFixed(2)} AI tokens, which is less than the required minimum of ${MIN_TOKENS_REQUIRED}. Please contact the developers or buy some AI tokens to continue.`
		);
	}
};

/**
 * Deducts tokens based on usage after an OpenAI API call.
 * @param {Object} userTokens - The user's token document.
 * @param {Number} tokensUsed - The number of tokens used in the API call.
 * @param {Object} session - The mongoose session for transaction.
 * @returns {Object} - Updated userTokens object.
 */
const deductTokens = async (userTokens, tokensUsed, session) => {
	if (userTokens.currentTokens < tokensUsed) {
		userTokens.currentTokens = 0; // Set to 0 if usage exceeds current tokens
	} else {
		userTokens.currentTokens -= tokensUsed; // Deduct tokens normally
	}

	await userTokens.save({ session }); // Save the updated tokens
	return userTokens;
};

/**
 * Calls OpenAI's APIs with conversation history and optional function calling.
 * @param {Number} userId - The ID of the user.
 * @param {Array} conversationHistory - The conversation history, including user and assistant messages.
 * @param {Array} functions - Optional. Array of available functions for OpenAI to call.
 * @param {string} model - Optional. Model to call. Default is 'gpt-4o-mini'.
 * @param {string} role - Optional. The role of the user. Default is 'user'.
 * @returns {Promise<Object>} - The response from OpenAI.
 */
export const callOpenaiService = async (
	userId = null,
	conversationHistory = null,
	functions = undefined,
	model = "gpt-4o-mini",
	role = "user"
) => {
	let session;

	try {
		// Validate the model before making the API call
		if (!validModels.includes(model)) {
			throw new Error(
				`Invalid model: ${model}. Please use one of the valid models: ${validModels.join(", ")}`
			);
		}
		if (!validRoles.includes(role)) {
			throw new Error(
				`Invalid role: ${role}. Please use one of the valid roles: ${validRoles.join(", ")}`
			);
		}

		if (
			role === "user" &&
			!(typeof userId === "number" && Number.isInteger(userId) && userId >= 0)
		) {
			throw new Error(
				`Invalid userId: ${userId}. Please provide a valid userId`
			);
		}

		// Fetch the user's current token balance and subscription
		let userTokens = await UserTokens.findOne({ userId }).populate(
			"aiSubscriptionId"
		);
		if (!userTokens) {
			await assignSubscriptionToUser(userId, "free");
			userTokens = await UserTokens.findOne({ userId }).populate(
				"aiSubscriptionId"
			);
		}
		if (!userTokens) {
			throw new Error(`Could not find user tokens for userId: ${userId}.`);
		}

		// Reset tokens if it's a new month
		userTokens = await resetTokensIfNewMonth(userTokens);
		// Check if the user has enough tokens
		checkTokenAvailability(userTokens);
		let response;
		// Call OpenAI with conversation history and function calling capabilities
		try {
			const openai = await connectOpenai();
			response = await openai.chat.completions.create({
				model, // Use the specified model
				messages: conversationHistory,
				functions, // Optional: include functions if needed
				function_call: functions ? "auto" : undefined,
			});
		} catch (error) {
			logError(error);
			throw new Error(
				`There was some issue connecting to our servers. Please try again later.`
			);
		}

		// Asynchronously perform token deduction and commit after sending the response
		setImmediate(async () => {
			session = await mongoose.startSession();
			session.startTransaction();

			try {
				const inputTokensUsed = response.usage.prompt_tokens;
				const outputTokensUsed = response.usage.completion_tokens;

				const aiTokensUsed = await calculateAiTokens(
					inputTokensUsed,
					outputTokensUsed,
					model
				);

				// Deduct tokens after the API call
				userTokens = await deductTokens(userTokens, aiTokensUsed, session);

				await session.commitTransaction();
				session.endSession();
				logInfo(
					`Tokens used: ${aiTokensUsed.toFixed(2)} by userId ${userId}, Tokens Left: ${userTokens.currentTokens.toFixed(2)}`
				);
			} catch (error) {
				await session.abortTransaction();
				session.endSession();
				logError(
					`Failed to deduct tokens asynchronously for userId ${userId}: ${error.message}`
				);
			}
		});

		return response; // Send the reply immediately
	} catch (error) {
		if (session) {
			await session.abortTransaction();
			session.endSession();
		}
		logError("Failed to call OpenAI API: " + error.message);
		throw error;
	}
};
