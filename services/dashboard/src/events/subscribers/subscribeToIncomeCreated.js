import { logError, EVENTS, subscribeEvent } from "@expensio/sharedlib";
import { addIncomeToDashboardService } from "../../services/dashboardService.js";

export const subscribeToIncomeCreated = async (channel) => {
	const eventName = EVENTS.INCOME_CREATED;
	try {
		await subscribeEvent(
			eventName,
			"dashboard-service-income-created",
			async ({ data, headers }) => {
				await addIncomeToDashboardService(data);
			},
			channel
		);
	} catch (error) {
		logError(`FAILED TO SUBSCRIBE TO ${eventName}.`);
		logError(error.message);
		throw error;
	}
};
