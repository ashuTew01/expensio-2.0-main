import { logError, EVENTS, subscribeEvent } from "@expensio/sharedlib";
import { addIncomeFinancialDataService } from "../../services/financialDataService.js";

export const subscribeToIncomeCreated = async (channel) => {
	const eventName = EVENTS.INCOME_CREATED;
	try {
		await subscribeEvent(
			eventName,
			"financial-data-service-income-created",
			async ({ data, headers }) => {
				await addIncomeFinancialDataService(data);
			},
			channel
		);
	} catch (error) {
		logError(`FAILED TO SUBSCRIBE TO ${eventName}.`);
		logError(error.message);
		throw error;
	}
};
