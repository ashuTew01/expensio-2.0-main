import {
	EVENTS,
	logError,
	logInfo,
	produceEvent,
	TOPICS,
} from "@expensio/sharedlib";
import { deleteExpensesByUserId } from "../../services/expenseService.js";
import { connectKafka } from "../../config/connectKafka.js";

/**
 * Event handler for the USER_DELETED event.
 *
 * Deletes all expenses belonging to the deleted user.
 *
 * If deletion fails, publish the USER_DELETION_FAILED event to undo the user deletion in the user service.
 *
 * @param {Object} message - The event message.
 * @param {string} message.userId - The ID of the deleted user.
 * @param {string} message.userPhone - The phone number of the deleted user.
 */
export const userDeletedEventHandler = async (message) => {
	const { userId, userPhone } = message;
	try {
		logInfo(
			`User with id ${userId} was deleted. Trying to delete its expenses...`
		);
		await deleteExpensesByUserId(userId);
	} catch (error) {
		// Publish the failure event to undo the user deletion in the user service
		try {
			logError(`Publishing failure event: ${EVENTS.USER_DELETION_FAILED}`);
			const { producerInstance } = await connectKafka();
			await produceEvent(
				EVENTS.USER_DELETION_FAILED,
				{
					userId,
					userPhone,
					error: error.message,
				},
				TOPICS.USER,
				producerInstance
			);
		} catch (publishError) {
			logError(
				`Failed to publish USER_DELETION_FAILED event for user ${userId}: ${publishError.message}`
			);
		}

		throw error; // Re-throw the original error to ensure the message is sent to DLX
	}
};
