import { logError, EVENTS, subscribeEvent } from "@expensio/sharedlib";
import { removeIncomesFromDashboardService } from "../../services/dashboardService.js";

export const subscribeToIncomesDeleted = async (channel) => {
	const eventName = EVENTS.INCOME_DELETED;
	try {
		await subscribeEvent(
			eventName,
			"dashboard-service-income-deleted",
			async ({ data, headers }) => {
				await removeIncomesFromDashboardService(data);
			},
			channel
		);
	} catch (error) {
		logError(`FAILED TO SUBSCRIBE TO ${eventName}.`);
		logError(error.message);
		throw error;
	}
};
