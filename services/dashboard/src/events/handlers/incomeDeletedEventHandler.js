import { removeIncomesFromDashboardService } from "../../services/dashboardService.js";

export const incomeDeletedEventHandler = async (message) => {
	await removeIncomesFromDashboardService(message);
};
