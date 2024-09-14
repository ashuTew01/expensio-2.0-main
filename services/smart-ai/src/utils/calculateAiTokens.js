import { openaiModels, validModels } from "./openaiApiModels.js";
import { oneDollarToTokens } from "../models/UserTokens.js";
import { ValidationError } from "@expensio/sharedlib";

/**
 * Calculates the number of AI tokens required to make an OpenAI API call, given input/output tokens and the model used.
 * @param {Number} inputTokens - Input tokens for the API call.
 * @param {Number} outputTokens - Output tokens for the API call.
 * @param {String} model - The model used for the API call (e.g. 'gpt-4o-2024-08-06').
 * @returns {Promise<Number>} - The number of AI tokens required to make the API call.
 */
export const calculateAiTokens = async (inputTokens, outputTokens, model) => {
	if (!validModels.includes(model)) throw new ValidationError("Invalid model");
	if (!inputTokens || !outputTokens)
		throw new ValidationError("Invalid tokens");

	const modelPricing = openaiModels[model].pricing;

	if (!modelPricing) throw new ValidationError("Invalid model");

	const inputPrice =
		inputTokens * (modelPricing.input / modelPricing.perTokens);
	const outputPrice =
		outputTokens * (modelPricing.output / modelPricing.perTokens);
	const totalPriceInDollars = inputPrice + outputPrice;

	const aiTokens = totalPriceInDollars * oneDollarToTokens;

	return aiTokens;
};
