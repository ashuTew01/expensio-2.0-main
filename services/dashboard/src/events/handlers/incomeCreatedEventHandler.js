import { addIncomeToDashboardService } from "../../services/dashboardService.js";

export const incomeCreatedEventHandler = async (message) => {
	await addIncomeToDashboardService(message);
};
