import OpenAI from "openai"; // No Configuration import
import dotenv from "dotenv";
import { logError } from "@expensio/sharedlib";
// Load environment variables from .env file
dotenv.config();

// Create the OpenAI instance directly with the API key
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY, // API key from your environment variables
});

// List of valid OpenAI models (expand based on available models)
const validModels = [
	"gpt-4",
	"gpt-3.5-turbo",
	"gpt-3.5",
	"gpt-4-32k",
	"gpt-4-turbo",
	"gpt-4o-mini",
];

/**
 * Calls OpenAI's GPT-4 with conversation history and optional function calling.
 * @param {Array} conversationHistory - The conversation history, including user and assistant messages.
 * @param {Array} functions - Optional. Array of available functions for OpenAI to call.
 * @param {string} model - Optional. Model to call. Default is 'gpt-4'.
 * @returns {Promise<Object>} - The response from OpenAI.
 */
export const callOpenAI = async (
	conversationHistory = null,
	functions = [],
	model = "gpt-4o-mini"
) => {
	try {
		// Validate the model before making the API call
		if (!validModels.includes(model)) {
			throw new Error(
				`Invalid model: ${model}. Please use one of the valid models: ${validModels.join(", ")}`
			);
		}

		// Call OpenAI with conversation history and function calling capabilities
		const response = await openai.chat.completions.create({
			model, // Use the specified model (default gpt-4)
			messages: conversationHistory, // Send the entire conversation history
			functions, // Optional: include functions if needed
			function_call: functions.length ? "auto" : undefined, // Let GPT-4 decide when to call a function
		});

		return response; // Return the API response
	} catch (error) {
		logError("Failed to call OpenAI API: " + error.message);
		console.error(error);
		throw error;
	}
};
