import { logInfo } from "@expensio/sharedlib";
import OpenAI from "openai";

// Singleton openai instance
let openai;

export const connectOpenai = async () => {
	while (!openai) {
		logInfo("Connecting to OpenAI...");

		openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});

		logInfo("Connected to OpenAI.");
	}
	return openai;
};
