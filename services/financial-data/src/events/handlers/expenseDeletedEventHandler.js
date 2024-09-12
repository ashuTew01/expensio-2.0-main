import { removeExpenseFinancialDataService } from "../../services/financialDataService.js";

export const expenseDeletedEventHandler = async (message) => {
	await removeExpenseFinancialDataService(message);
};
