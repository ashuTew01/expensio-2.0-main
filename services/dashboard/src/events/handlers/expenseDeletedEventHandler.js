import { removeExpensesFromDashboardService } from "../../services/dashboardService.js";

export const expenseDeletedEventHandler = async (message) => {
	await removeExpensesFromDashboardService(message);
};
