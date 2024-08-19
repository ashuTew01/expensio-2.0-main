import {
	logError,
	logInfo,
	publishEvent,
	subscribeEvent,
} from "@expensio/sharedlib";
import { EVENTS } from "@expensio/sharedlib";
import { deleteExpensesByUserId } from "../../services/expenseService.js";

export const subscribeToUserDeleted = async (channel) => {
	const eventName = EVENTS.USER_DELETED;
	try {
		await subscribeEvent(
			eventName,
			"expense-service-user-deleted",
			async ({ data, headers }) => {
				const { userId, userPhone } = data;

				try {
					logInfo(
						`User with id ${userId} was deleted. Trying to delete its expenses...`
					);
					await deleteExpensesByUserId(userId);
				} catch (error) {
					// Publish the failure event to undo the user deletion in the user service
					try {
						logError(
							`Publishing failure event: ${EVENTS.USER_DELETION_FAILED}`
						);
						await publishEvent(
							EVENTS.USER_DELETION_FAILED,
							{
								userId,
								userPhone,
								error: error.message,
							},
							channel
						);
					} catch (publishError) {
						logError(
							`Failed to publish USER_DELETION_FAILED event for user ${userId}: ${publishError.message}`
						);
					}

					throw error; // Re-throw the original error to ensure the message is sent to DLX
				}
			},
			channel
		);
	} catch (error) {
		logError(`FAILED TO SUBSCRIBE TO ${eventName}.`);
		logError(error);
		throw error;
	}
};
