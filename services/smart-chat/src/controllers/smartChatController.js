import { callOpenAI } from "../utils/openaiClient.js";
import { openAIGeneralFunctions } from "../utils/openaiFunctions.js";
import { handleCreateExpenseService } from "../services/smartChatService.js";
import ConversationHistory from "../models/ConversationHistory.js";

const MAX_CONVERSATION_HISTORY_LIMIT = 150;

/**
 * Handles the user input and determines the next action.
 * @param {string} message - The user's input message.
 * @param {Socket} socket - The WebSocket connection.
 */
export const handleUserInputController = async (message, socket) => {
	try {
		const userId = socket.user.id;
		const initialPrompt = {
			role: "system",
			content:
				"You are a helpful financial assistant. Always keep responses concise and provide financial advice and/or call functions when appropriate.",
		};

		// Ensure message is within character limit
		if (message.length > 2000) {
			socket.emit("response", {
				type: "error",
				message: "Message too long. Please keep it under 2000 characters.",
			});
			return;
		}

		// Retrieve conversation history from DB
		let conversationHistory = await ConversationHistory.findOne({ userId });

		// Initialize conversation history if not present in DB
		if (!conversationHistory) {
			conversationHistory = new ConversationHistory({
				userId,
				history: [], // Do not store the initialPrompt in DB, but use it when sending to OpenAI
			});
		}

		// Add the user's latest message to the conversation history
		conversationHistory.history.push({ role: "user", content: message });

		// Enforce limit of 150 messages
		if (conversationHistory.history.length > MAX_CONVERSATION_HISTORY_LIMIT) {
			conversationHistory.history.shift(); // Remove the oldest message
		}

		// Combine the initialPrompt and the stored conversation history when calling OpenAI
		//Initial prompt kept out so that it doesn't get pop after max_limit.
		const historyForOpenAI = [initialPrompt, ...conversationHistory.history];

		// Call OpenAI to understand the message and determine function calls
		const aiResponse = await callOpenAI(
			historyForOpenAI,
			openAIGeneralFunctions
		);

		// If OpenAI suggests a function to call
		const functionCall = aiResponse.choices[0].message.function_call;
		if (functionCall) {
			socket.emit("response", {
				type: "general_response",
				message: aiResponse.choices[0].message.content,
			});
			const { name } = functionCall;

			switch (name) {
				case "createExpense":
					const expenseTitle = await handleCreateExpenseService(
						socket,
						message
					);
					conversationHistory.history.push({
						role: "assistant",
						content: `Created Expense: ${expenseTitle}`,
					});
					break;

				// Handle other cases for income, financial data, etc.
				// ...

				default:
					socket.emit("response", {
						type: "loading",
						message: "Unrecognized function.",
					});
			}
		} else {
			// Handle general queries or responses

			// Add OpenAI's response to the conversation history
			conversationHistory.history.push({
				role: "assistant",
				content: aiResponse.choices[0].message.content,
			});

			// Save updated conversation history
			await conversationHistory.save();

			socket.emit("response", {
				type: "general_response",
				message: aiResponse.choices[0].message.content,
			});
		}
		// Save updated conversation history
		await conversationHistory.save();
	} catch (error) {
		console.error(error);
		socket.emit("response", {
			type: "error",
			message: "An error occurred. Please try again.",
		});
	}
};
