import { callOpenaiService } from "../services/openaiService.js";
import { openAIGeneralFunctions } from "../utils/openaiFunctions.js";
import {
	handleCreateExpenseService,
	handleCreateIncomeService,
	handleGetFinancialDataService,
} from "../services/smartChatService.js";
import ConversationHistory from "../models/ConversationHistory.js";
import { logError } from "@expensio/sharedlib";

const MAX_CONVERSATION_HISTORY_LIMIT = 75;

export const smartChatTestController = async (req, res) => {
	res
		.status(200)
		.json({ status: "Smart Chat service is working. (GET @ /test)" });
};

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
			content: `THIS IS JUST A SYSTEM PROMPT, ALWAYS ATTACHED TO HISTORY TO HELP YOU. USER's MESSAGE IS ABOVE THIS. Date: ${new Date()}. You are a helpful financial assistant. 
			    Dont answer queries if the user's messages get too drifted off the financial related domain.
				1. Always try to interpret what the user wants to do before calling any function, or simply asking for a simple query. 
				2. If you think expense/income is to be created: If you can infer the title and amount, call the createExpense function, don't trouble the user into asking. If it is impossible to infer these, then only ask the user to provide details of the expense/income. 
				3. If the user sends a message like "Hello" or similar, that means he is most likely starting a new chat, dont trouble him what he was doing before that chat unless he asks.
			`,
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

		// Enforce limit of messages
		while (
			conversationHistory.history.length > MAX_CONVERSATION_HISTORY_LIMIT
		) {
			conversationHistory.history.shift(); // Remove the oldest message
		}

		// Combine the initialPrompt and the stored conversation history when calling OpenAI
		//Initial prompt kept out so that it doesn't get pop after max_limit.
		const historyForOpenAI = [...conversationHistory.history, initialPrompt];

		// Call OpenAI to understand the message and determine function calls
		const aiResponse = await callOpenaiService(
			userId,
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
			let incomeTitle, expenseTitle;
			switch (name) {
				case "createExpense":
					expenseTitle = await handleCreateExpenseService(
						socket,
						conversationHistory
					);
					conversationHistory.history.push({
						role: "assistant",
						content: `Function createExpense called: Created Expense, ${expenseTitle}`,
					});
					break;

				case "createIncome":
					incomeTitle = await handleCreateIncomeService(
						socket,
						conversationHistory
					);
					conversationHistory.history.push({
						role: "assistant",
						content: `Function createIncome called: Created Income, ${incomeTitle}`,
					});
					break;

				case "getFinancialData":
					await handleGetFinancialDataService(socket, conversationHistory);
					conversationHistory.history.push({
						role: "assistant",
						content: `Function getFinancialData called and data sent successfully.`,
					});
					break;

				// Handle other cases for financial data, etc.
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
		logError(error);
		socket.emit("response", {
			type: "error",
			message: "An error occurred. Please try again.",
		});
	}
};
