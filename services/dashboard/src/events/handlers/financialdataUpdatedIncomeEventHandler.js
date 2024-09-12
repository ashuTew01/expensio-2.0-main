import { updateIncomeFinancialDataService } from "../../services/dashboardService.js";

export const financialdataUpdatedIncomeEventHandler = async (message) => {
	await updateIncomeFinancialDataService(message);
};
