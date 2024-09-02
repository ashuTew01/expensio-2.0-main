import { logError, EVENTS, subscribeEvent } from "@expensio/sharedlib";
import { updateIncomeFinancialDataService } from "../../services/dashboardService.js";

export const subscribeToIncomeFinancialDataUpdated = async (channel) => {
	const eventName = EVENTS.FINANCIALDATA_UPDATED_INCOME;
	try {
		await subscribeEvent(
			eventName,
			"dashboard-service-income-financialdata-updated",
			async ({ data, headers }) => {
				await updateIncomeFinancialDataService(data);
			},
			channel
		);
	} catch (error) {
		logError(`FAILED TO SUBSCRIBE TO ${eventName}.`);
		logError(error.message);
		throw error;
	}
};
