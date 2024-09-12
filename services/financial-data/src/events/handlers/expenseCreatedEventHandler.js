import { addExpenseFinancialDataService } from "../../services/financialDataService.js";

export const expenseCreatedEventHandler = async (message) => {
	await addExpenseFinancialDataService(message);
};
