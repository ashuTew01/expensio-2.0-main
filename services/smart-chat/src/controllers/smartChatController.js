import { callOpenAI } from "../utils/openaiClient.js";
import { openAIGeneralFunctions } from "../utils/openaiFunctions.js";
import { handleCreateExpenseService } from "../services/smartChatService.js";

// In-memory conversation history (use DB later)
const conversationHistories = {};

/**
 * Handles the user input and determines the next action.
 * @param {string} message - The user's input message.
 * @param {Socket} socket - The WebSocket connection.
 */
export const handleUserInputController = async (message, socket) => {
	try {
		const userId = socket.user.id;
		const initialPrompt = `Respond only to Finance related, or function calling related queries. Politely reject everything else. Answer short.`;

		// Ensure message is within character limit
		if (message.length > 2000) {
			socket.emit("response", {
				type: "error",
				message: "Message too long. Please keep it under 2000 characters.",
			});
			return;
		}

		// Initialize conversation history if not present
		if (!conversationHistories[userId]) {
			conversationHistories[userId] = [
				{ role: "assistant", content: initialPrompt },
			];
		}

		// Add the user's latest message to the conversation history
		conversationHistories[userId].push({
			role: "user",
			content: message || "",
		});

		// Call OpenAI to understand the message and determine function calls
		const aiResponse = await callOpenAI(
			conversationHistories[userId],
			openAIGeneralFunctions
		);
		// console.log(aiResponse.choices[0].message.content);

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
					await handleCreateExpenseService(
						socket,
						conversationHistories[userId],
						message
					);
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

			// Add assistant's response to the conversation history
			conversationHistories[userId].push({
				role: "assistant",
				content: aiResponse.choices[0].message.content || "",
			});
			socket.emit("response", {
				type: "general_response",
				message: aiResponse.choices[0].message.content,
			});
		}
	} catch (error) {
		socket.emit("response", {
			type: "error",
			message: "An error occurred. Please try again.",
		});
	}
};
