import { callOpenaiService } from "../services/openaiService.js";
import { openAIGeneralFunctions } from "../utils/openaiFunctions.js";
import {
	handleCreateExpenseService,
	handleCreateIncomeService,
	// handleGetFinancialDataService,
	handleUseFinancialDataService,
} from "../services/smartChatService.js";
import ConversationHistory from "../models/ConversationHistory.js";
import { logError } from "@expensio/sharedlib";
import config from "../config/config.js";

const MAX_CONVERSATION_HISTORY_LIMIT = config.MAX_CONVERSATION_HISTORY_LIMIT;

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
		const date = new Date();
		const formattedDate = date.toLocaleDateString("en-US", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
		const nameOfUser = socket.nameOfUser;
		const initialPrompt = {
			role: "system",
			content: `You are Expensio's Smart AI assistant, a mature, witty, and highly knowledgeable financial expert with PhDs in Money, Economics, Behavior, and Psychology. Your goal is to provide tailored, insightful financial advice while keeping things light and engaging.
						Always interpret the user's intent before asking for more details or calling functions.
						For expense/income creation: infer the title and amount when possible, only ask for details if necessary.
						Stay focused on financial matters; avoid answering off-topic queries.
						Keep responses short. If needed too much, you can make it not short.
						Expensio helps users track expenses, income, and spending patterns, offering personalized financial insights and summaries. It analyzes moods, behaviors, and cognitive triggers to provide tailored strategies for smarter financial management.
					    If greeted with "Hello" or similar, assume the user is starting fresh—no need to reference previous chats unless asked. Today is ${formattedDate}. ${nameOfUser ? "User's Name is " + nameOfUser : ""}
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
		let aiResponse;
		// Call OpenAI to understand the message and determine function calls
		try {
			aiResponse = await callOpenaiService(
				userId,
				historyForOpenAI,
				openAIGeneralFunctions
			);
		} catch (error) {
			socket.emit("response", {
				type: "error",
				message: error.message,
			});
			logError(error);
			return;
		}

		// If OpenAI suggests a function to call
		const functionCall = aiResponse.choices[0].message.function_call;
		const functionArgs = functionCall?.arguments || null;
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

				// case "getFinancialData":
				// 	await handleGetFinancialDataService(socket, conversationHistory);
				// 	conversationHistory.history.push({
				// 		role: "assistant",
				// 		content: `Function getFinancialData called and data sent successfully.`,
				// 	});
				// 	break;

				case "useFinancialData":
					await handleUseFinancialDataService(
						socket,
						conversationHistory,
						functionArgs,
						formattedDate
					);
					break;

				// Handle other cases for financial data, etc.
				// ...

				default:
					socket.emit("response", {
						type: "error",
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
		// logError(error);
		socket.emit("response", {
			type: "error",
			message: "An error occurred. Please try again.",
		});
	}
};
