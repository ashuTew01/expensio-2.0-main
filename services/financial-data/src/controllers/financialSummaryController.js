import { ValidationError } from "@expensio/sharedlib";
import {
	buildFinancialSummaryService,
	getFinancialSummaryService,
} from "../services/financialSummaryService.js";

/**
 * Controller to fetch the financial summary.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const getFinancialSummaryController = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const { timePeriod, year, month } = req.query;
		const dateDetails = { year: Number(year), month: Number(month) };

		if (!timePeriod || !dateDetails) {
			throw new ValidationError("Invalid query parameters");
		}
		const validTimePeriods = ["monthly", "last3months", "last6months"];

		if (!validTimePeriods.includes(timePeriod)) {
			throw new ValidationError("Invalid Time Period");
		}
		const result = await getFinancialSummaryService(
			userId,
			timePeriod,
			dateDetails
		);
		if (result.message === "OK") {
			return res.status(200).json(result);
		} else {
			return res.status(404).json(result);
		}
	} catch (error) {
		next(error);
	}
};

/**
 * Controller to build the financial summary using AI.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const buildFinancialSummaryController = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const { timePeriod, year, month } = req.query;
		const { userToken } = req; // Bearer token to access the SMART AI Service
		const dateDetails = { year: Number(year), month: Number(month) };
		const validTimePeriods = ["monthly", "last3months", "last6months"];

		if (!validTimePeriods.includes(timePeriod)) {
			throw new ValidationError("Invalid Time Period");
		}

		// console.log(`${userId}\n${timePeriod}\n${year}\n${month}\n${userToken}`);
		const result = await buildFinancialSummaryService(
			userId,
			timePeriod,
			dateDetails,
			userToken
		);
		return res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
