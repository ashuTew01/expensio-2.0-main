import {
	getExpenseFinancialDataService,
	getIncomeFinancialDataService,
} from "../services/financialDataService.js";

export const getExpenseFinancialDataController = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const { monthYearPairs } = req.body;
		if (!Array.isArray(monthYearPairs) || monthYearPairs.length === 0) {
			return res.status(400).json({ message: "Invalid monthYearPairs array" });
		}

		const data = await getExpenseFinancialDataService(userId, monthYearPairs);
		res.status(200).json(data);
	} catch (error) {
		next(error);
	}
};

export const getIncomeFinancialDataController = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const { monthYearPairs } = req.body;
		if (!Array.isArray(monthYearPairs) || monthYearPairs.length === 0) {
			return res.status(400).json({ message: "Invalid monthYearPairs array" });
		}

		const data = await getIncomeFinancialDataService(userId, monthYearPairs);
		res.status(200).json(data);
	} catch (error) {
		next(error);
	}
};
