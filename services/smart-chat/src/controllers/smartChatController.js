import { callOpenAI } from "../utils/openaiClient.js";
import { openAIGeneralFunctions } from "../utils/openaiFunctions.js";
import {
	handleCreateExpenseService,
	handleCreateIncomeService,
} from "../services/smartChatService.js";
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
			content: `THIS IS JUST A SYSTEM PROMPT, ALWAYS ATTACHED TO HISTORY TO HELP YOU. USER's MESSAGE IS ABOVE THIS. You are a helpful financial assistant. 
				1. Always try to interpret whether the user wants to create an income or expense before calling any function, or simply asking for a simple query. 
				2. If the user clearly provides details like title and amount, infer the category and other relevant details, then proceed with the function call.
				3. If you cannot infer the title or amount, or if the details are missing, ask the user to provide all the details in one message.
				4. If the user confirms with a response like 'Yes' or 'Please do that', remind the user that their previous attempt at creating the expense or income was incomplete and they must provide the details again in a single message.
				5. Never ask the user to confirm the creation of expenses or incomes. Either call function or prompt them to resend all the details in one single message.`,
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
		const historyForOpenAI = [...conversationHistory.history, initialPrompt];

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
						content: `Function createExpense called: Created Expense, ${expenseTitle}`,
					});
					break;

				case "createIncome":
					const incomeTitle = await handleCreateIncomeService(socket, message);
					conversationHistory.history.push({
						role: "assistant",
						content: `Function createIncome called: Created Income, ${incomeTitle}`,
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
		console.error(error);
		socket.emit("response", {
			type: "error",
			message: "An error occurred. Please try again.",
		});
	}
};
