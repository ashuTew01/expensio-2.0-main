import axios from "axios";
import FinancialSummary from "../models/FinancialSummary.js";
import {
	getExpenseFinancialDataService,
	getIncomeFinancialDataService,
} from "./financialDataService.js";
import { formatFinancialData } from "../utils/formatFinancialData.js";
import { financialSummaryPrompt } from "../data/aiPrompts.js";
import { generateFinancialSummaryFunction } from "../utils/openaiFunctions.js";

/**
 * Service to check and retrieve the financial summary if it exists.
 * @param {String} userId - The ID of the user.
 * @param {String} timePeriod - The time period of the summary ('monthly', 'last3months', 'last6months').
 * @param {Object} dateDetails - Contains year and month for 'monthly' type summaries.
 * @param {Number} xDaysThreshold - The threshold to check whether a summary is outdated for the current month.
 * @returns {Object} - The summary or a message indicating it's unavailable.
 */
export const getFinancialSummaryService = async (
	userId,
	timePeriod,
	dateDetails,
	xDaysThreshold = 3
) => {
	let summary;
	const { year, month } = dateDetails || {};
	const currentDate = new Date();

	if (timePeriod === "monthly") {
		summary = await FinancialSummary.findOne({
			userId,
			timePeriod,
			year,
			month,
		});

		if (summary) {
			// If not current month, check lastComputedAt
			if (
				year !== currentDate.getFullYear() ||
				month !== currentDate.getMonth() + 1
			) {
				const summaryDate = new Date(summary.lastComputedAt);
				if (
					summaryDate.getFullYear() > year ||
					(summaryDate.getFullYear() === year &&
						summaryDate.getMonth() + 1 > month)
				) {
					return { message: "OK", summary };
				}
			} else {
				// For current month, check the freshness
				const daysAgo =
					(currentDate - summary.lastComputedAt) / (1000 * 60 * 60 * 24);
				if (daysAgo < xDaysThreshold) {
					return { message: "OK", summary };
				}
			}
		}

		return { message: "UNAVAILABLE" };
	} else if (["last3months", "last6months"].includes(timePeriod)) {
		summary = await FinancialSummary.findOne({ userId, timePeriod });
		if (summary) {
			const endDate = new Date(summary.endDate);
			if (
				endDate.getFullYear() === currentDate.getFullYear() &&
				endDate.getMonth() === currentDate.getMonth() - 1
			) {
				return { message: "OK", summary };
			}
		}

		return { message: "UNAVAILABLE" };
	}
};

/**
 * Builds the financial summary using the OpenAI API.
 * @param {String} userId - The ID of the user.
 * @param {String} timePeriod - The time period of the summary ('monthly', 'last3months', 'last6months').
 * @param {Object} dateDetails - Contains year and month for 'monthly' type summaries.
 * @param {String} userToken - Bearer token to access the SMART AI Service.
 * @returns {Object} - The newly generated summary.
 */
export const buildFinancialSummaryService = async (
	userId,
	timePeriod,
	dateDetails,
	userToken
) => {
	const { year, month } = dateDetails || {};
	let expenseFinancialData;
	let incomeFinancialData;

	// Retrieve expense financial data based on the time period
	const getMonthsAndYears = (monthsToSubtract) => {
		const currentDate = new Date();
		const result = [];
		let currentMonth = currentDate.getMonth();
		let currentYear = currentDate.getFullYear();

		for (let i = 0; i < monthsToSubtract; i++) {
			if (currentMonth === 0) {
				currentMonth = 12; // Go back to December
				currentYear -= 1; // Move to the previous year
			}
			result.push({ month: currentMonth, year: currentYear });
			currentMonth -= 1;
		}

		return result;
	};
	let existingSummary;

	if (timePeriod === "monthly") {
		// Look for existing summary for the specific month and year
		existingSummary = await FinancialSummary.findOne({
			userId,
			timePeriod,
			month,
			year,
		});
		if (!existingSummary) {
			existingSummary = new FinancialSummary({
				userId,
				timePeriod,
				month,
				year,
			});
		}

		// Fetch financial data for the specific month
		expenseFinancialData = await getExpenseFinancialDataService(userId, [
			{ month, year },
		]);
		incomeFinancialData = await getIncomeFinancialDataService(userId, [
			{ month, year },
		]);
	} else if (timePeriod === "last3months") {
		// Check if there's already an existing summary for the last 3 months
		existingSummary = await FinancialSummary.findOne({ userId, timePeriod });

		// Get the last 3 months (previous months)
		const last3Months = getMonthsAndYears(3);
		const endDate = new Date(last3Months[0].year, last3Months[0].month - 1, 1); // Previous month
		const startDate = new Date(
			last3Months[2].year,
			last3Months[2].month - 1,
			1
		); // Start 3 months ago

		if (!existingSummary) {
			// Create a new summary for last 3 months if none exists
			existingSummary = new FinancialSummary({
				userId,
				timePeriod,
				startDate,
				endDate,
			});
		}

		// Fetch financial data for the last 3 months
		expenseFinancialData = await getExpenseFinancialDataService(
			userId,
			last3Months
		);
		incomeFinancialData = await getIncomeFinancialDataService(
			userId,
			last3Months
		);
	} else if (timePeriod === "last6months") {
		// Check if there's already an existing summary for the last 6 months
		existingSummary = await FinancialSummary.findOne({ userId, timePeriod });

		// Get the last 6 months (previous months)
		const last6Months = getMonthsAndYears(6);
		const endDate = new Date(last6Months[0].year, last6Months[0].month - 1, 1); // Previous month
		const startDate = new Date(
			last6Months[5].year,
			last6Months[5].month - 1,
			1
		); // Start 6 months ago

		if (!existingSummary) {
			// Create a new summary for last 6 months if none exists
			existingSummary = new FinancialSummary({
				userId,
				timePeriod,
				startDate,
				endDate,
			});
		}

		// Fetch financial data for the last 6 months
		expenseFinancialData = await getExpenseFinancialDataService(
			userId,
			last6Months
		);
		incomeFinancialData = await getIncomeFinancialDataService(
			userId,
			last6Months
		);
	}

	// Format financial data for AI processing
	const formattedData = formatFinancialData(
		expenseFinancialData,
		incomeFinancialData
	);

	// Create conversation history for OpenAI API call
	const conversationHistory = [
		{ role: "system", content: `${financialSummaryPrompt}\n${formattedData}` },
	];

	const axiosResponse = await axios.post(
		`${process.env.SMART_AI_SERVICE_URL}/callAI`,
		{
			conversationHistory,
			functions: [generateFinancialSummaryFunction],
		},
		{
			headers: {
				Authorization: `Bearer ${userToken}`,
			},
		}
	);
	// console.log(aiResponse);
	const aiResponse = axiosResponse.data.aiResponse;
	const summary = JSON.parse(
		aiResponse.choices[0].message.function_call.arguments
	);

	// Save the new summary to the database
	existingSummary.behavioralInsights = summary.behavioralInsights;
	existingSummary.personalityInsights = summary.personalityInsights;
	existingSummary.personalizedRecommendations =
		summary.personalizedRecommendations;
	existingSummary.benchmarking = summary.benchmarking;
	existingSummary.lastComputedAt = new Date();
	await existingSummary.save();

	return { message: "OK", summary: existingSummary };
};
