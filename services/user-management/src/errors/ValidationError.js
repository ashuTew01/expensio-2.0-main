import ApplicationError from "./ApplicationError.js";

export default class ValidationError extends ApplicationError {
	constructor(message = "Validation failed") {
		super(message, 400);
	}
}
