import { addExpenseToDashboardService } from "../../services/dashboardService.js";

export const expenseCreatedEventHandler = async (message) => {
	await addExpenseToDashboardService(message);
};
