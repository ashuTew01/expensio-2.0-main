import ApplicationError from "./ApplicationError.js";

export default class NotFoundError extends ApplicationError {
	constructor(message = "The requested resource was not found") {
		super(message, 404);
	}
}
