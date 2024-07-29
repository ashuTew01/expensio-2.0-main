import ApplicationError from "./ApplicationError.js";

export default class InternalServerError extends ApplicationError {
	constructor(message = "Internal server error") {
		super(message, 500);
	}
}
