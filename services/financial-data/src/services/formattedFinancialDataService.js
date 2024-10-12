import { formatFinancialDataCompact } from "../utils/formatFinancialDataCompact.js";
import {
	getExpenseFinancialDataService,
	getIncomeFinancialDataService,
} from "./financialDataService.js";

export const getCompactFinancialDataService = async (
	userId,
	monthYearPairs
) => {
	const incomeDataArray = await getIncomeFinancialDataService(
		userId,
		monthYearPairs
	);
	const expenseDataArray = await getExpenseFinancialDataService(
		userId,
		monthYearPairs
	);
	const compactFinancialData = formatFinancialDataCompact(
		expenseDataArray,
		incomeDataArray
	);
	return compactFinancialData;
};
