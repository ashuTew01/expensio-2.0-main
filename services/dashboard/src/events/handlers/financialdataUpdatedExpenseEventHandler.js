import { updateExpenseFinancialDataService } from "../../services/dashboardService.js";

export const financialdataUpdatedExpenseEventHandler = async (message) => {
	await updateExpenseFinancialDataService(message);
};
