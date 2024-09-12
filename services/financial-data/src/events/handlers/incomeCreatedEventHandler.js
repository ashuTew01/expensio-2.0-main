import { addIncomeFinancialDataService } from "../../services/financialDataService.js";

export const incomeCreatedEventHandler = async (message) => {
	await addIncomeFinancialDataService(message);
};
