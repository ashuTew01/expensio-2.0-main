import { getFinancialDataService } from "../services/financialDataService.js";

export const getFinancialDataController = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const { monthYearPairs } = req.body;
		if (!Array.isArray(monthYearPairs) || monthYearPairs.length === 0) {
			return res.status(400).json({ message: "Invalid monthYearPairs array" });
		}

		const data = await getFinancialDataService(userId, monthYearPairs);
		res.status(200).json(data);
	} catch (error) {
		next(error);
	}
};
