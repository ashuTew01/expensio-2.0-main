import { logError, EVENTS, subscribeEvent } from "@expensio/sharedlib";
import { updateExpenseFinancialDataService } from "../../services/dashboardService.js";

export const subscribeToExpenseFinancialDataUpdated = async (channel) => {
	const eventName = EVENTS.FINANCIALDATA_UPDATED_EXPENSE;
	try {
		await subscribeEvent(
			eventName,
			"dashboard-service-expense-financialdata-updated",
			async ({ data, headers }) => {
				await updateExpenseFinancialDataService(data);
			},
			channel
		);
	} catch (error) {
		logError(`FAILED TO SUBSCRIBE TO ${eventName}.`);
		logError(error.message);
		throw error;
	}
};
