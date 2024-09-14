import { callOpenaiService } from "./openaiService.js";
import axios from "axios"; // For making API calls to the expense service
import {
	openAICreateExpenseFunction,
	openAICreateIncomeFunction,
	openAIGetFinancialDataFunction,
} from "../utils/openaiFunctions.js";
import { logError } from "@expensio/sharedlib";

/**
 * Handles the expense creation process by communicating with OpenAI and the expense service.
 * @param {Socket} socket - The WebSocket connection.
 * @param {String} userMessage - The expense related message.
 * @returns {Promise} The title of the expense.
 */
export const handleCreateExpenseService = async (socket, userMessage) => {
	try {
		socket.emit("loading", {
			type: "loading",
			message: "Creating Expense. Please Wait...",
		});
		const prompt = `Create an expense from this message. 
                TRY TO INFER AND ASSUME AS MANY PARAMETERS AS POSSIBLE.. AND FOLLOW THESE RULES
                1. Title must be inferrable from user's message. Amount must be mentioned. Add 'purchase' or similar word at last of title to signify expense.'
                2. Infer the category from the given ones. 
                3. Infer AT LEAST one cognitive trigger; leave blank if none.  
                5. Use default mood (neutral) and paymentMethod (unknown). 
                6. Keep responses short.
                User's message: ${userMessage}
                If title, amount missing, or other issue, send just "NONE" in response, DO NOT CALL FUNCTION..
                    `;

		// Call OpenAI to get the expense details
		const aiResponse = await callOpenaiService(
			socket.user.id,
			[{ role: "system", content: prompt }],
			openAICreateExpenseFunction
		);
		if (aiResponse.choices[0].message.content === "NONE") {
			socket.emit("response", {
				type: "error",
				message:
					"Failed to create expense. Please provide correct expense details in just one message.",
			});
			return;
		}

		const functionArgs = JSON.parse(
			aiResponse.choices[0].message.function_call.arguments
		);

		// Prepare the data for the expense creation API
		const expenseData = {
			title: functionArgs.title,
			amount: functionArgs.amount,
			categoryCode: functionArgs.categoryCode,
			expenseType: functionArgs.expenseType,
			isRecurring: functionArgs.isRecurring || false,
			notes: functionArgs.notes || [], // optional
			cognitiveTriggerCodes: functionArgs.cognitiveTriggerCodes || [], // optional
			paymentMethod: functionArgs.paymentMethod || "unknown",
			mood: functionArgs.mood || "neutral",
			description: functionArgs.description || undefined, // optional
		};

		// Make the API call to create the expense
		const response = await axios.post(
			`${process.env.EXPENSE_SERVICE_URL}`,
			[expenseData],
			{
				headers: {
					Authorization: `Bearer ${socket.token}`,
				},
			}
		);
		const expenseTitle = await response?.data?.expenses[0]?.title;
		// Respond to the user with the confirmation
		socket.emit("response", {
			type: "expense_created",
			message: `Expense '${expenseTitle}' created successfully!`,
		});

		return expenseTitle;
	} catch (error) {
		socket.emit("response", {
			type: "error",
			message: "Failed to create expense.",
		});
		throw error;
	}
};

/**
 * Handles the income creation process by communicating with OpenAI and the income service.
 * @param {Socket} socket - The WebSocket connection.
 * @param {String} userMessage - The income-related message.
 * @returns {Promise} The title of the income.
 */
export const handleCreateIncomeService = async (socket, userMessage) => {
	try {
		socket.emit("loading", {
			type: "loading",
			message: "Creating Income. Please Wait...",
		});
		const prompt = `Just call the createIncome function and create an income from this message.
                TRY TO INFER AND ASSUME AS MANY PARAMETERS AS POSSIBLE.. AND FOLLOW THESE RULES
                1. Title must be inferrable from user's message. Amount must be mentioned. Add appropriate word at the end of the title to signify income.
                2. Infer the category from the given ones. 
                3. Use default description (empty) and isRecurring (false).
                4. Keep responses short.
                User's message: ${userMessage}
                If title, amount missing, or other issue, send just "NONE" in response, DO NOT CALL FUNCTION..
                    `;

		// Call OpenAI to get the income details
		const aiResponse = await callOpenaiService(
			socket.user.id,
			[{ role: "system", content: prompt }],
			openAICreateIncomeFunction
		);

		// If response content is "NONE", send error and return
		if (aiResponse.choices[0].message.content === "NONE") {
			socket.emit("response", {
				type: "error",
				message:
					"Failed to create income. Please provide correct income details in just one message.",
			});
			return;
		}

		const functionArgs = JSON.parse(
			aiResponse.choices[0].message.function_call.arguments
		);

		// Prepare the data for the income creation API
		const incomeData = {
			title: functionArgs.title,
			amount: functionArgs.amount,
			categoryCode: functionArgs.categoryCode,
			incomeType: functionArgs.incomeType,
			isRecurring: functionArgs.isRecurring || false,
			description: functionArgs.description || undefined,
		};

		// Make the API call to create the income
		const response = await axios.post(
			`${process.env.INCOME_SERVICE_URL}`,
			[incomeData],
			{
				headers: {
					Authorization: `Bearer ${socket.token}`,
				},
			}
		);

		const incomeTitle = response?.data?.incomes[0]?.title;

		// Respond to the user with the confirmation
		socket.emit("response", {
			type: "income_created",
			message: `Income '${incomeTitle}' created successfully!`,
		});

		return incomeTitle;
	} catch (error) {
		logError(error);
		socket.emit("response", {
			type: "error",
			message: "Failed to create income.",
		});
	}
};

/**
 * Handles the retrieval of financial data (expense/income/both) by communicating with OpenAI and the financial data service.
 * @param {Socket} socket - The WebSocket connection.
 * @param {String} userMessage - The message asking for financial data.
 */
export const handleGetFinancialDataService = async (socket, userMessage) => {
	try {
		// Emit a loading message
		socket.emit("loading", {
			type: "loading",
			message: "Fetching Financial Data. Please Wait...",
		});

		// Get the current date (used in the prompt to infer ranges like "last 6 months")
		// const currentDate = dayjs().format("MMMM YYYY");

		// Prepare the prompt for OpenAI to understand the financial data request
		const prompt = `The user is asking for financial data (expenses, income, or both) based on this message:
                ${userMessage}
                Today is ${new Date()}. If the user requests data for past months, infer the correct month-year pairs for the requested duration (e.g., last 6 months). 
                Call the function with the parameters.
                    `;

		// Call OpenAI to interpret the message and get the required parameters
		const aiResponse = await callOpenaiService(
			socket.user.id,
			[{ role: "system", content: prompt }],
			openAIGetFinancialDataFunction
		);

		const functionArgs = JSON.parse(
			aiResponse.choices[0].message.function_call.arguments
		);

		const { type, monthYearPairs } = functionArgs;

		// Ensure monthYearPairs is valid
		if (!Array.isArray(monthYearPairs) || monthYearPairs.length === 0) {
			socket.emit("response", {
				type: "error",
				message: "Failed to fetch financial data. Invalid month/year pair.",
			});
			return;
		}
		// Build the API calls based on the type
		let financialData = {};
		if (type === "expense" || type === "both") {
			const expenseResponse = await axios.post(
				`${process.env.FINANCIALDATA_SERVICE_URL}/expense`,
				{ monthYearPairs },
				{
					headers: {
						Authorization: `Bearer ${socket.token}`,
					},
				}
			);
			financialData.expense = expenseResponse.data;
		}

		if (type === "income" || type === "both") {
			const incomeResponse = await axios.post(
				`${process.env.FINANCIALDATA_SERVICE_URL}/income`,
				{ monthYearPairs },
				{
					headers: {
						Authorization: `Bearer ${socket.token}`,
					},
				}
			);
			financialData.income = incomeResponse.data;
		}

		// Send the aggregated data back to the client
		socket.emit("financial-data", {
			type: "financial-data",
			message: financialData, // The complete financial data from both APIs (if applicable)
		});
	} catch (error) {
		logError(error);
		socket.emit("response", {
			type: "error",
			message: "Failed to retrieve financial data.",
		});
	}
};
