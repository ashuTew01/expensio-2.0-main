import ApplicationError from "./ApplicationError.js";

export default class AuthorizationError extends ApplicationError {
	constructor(message = "Authorization failed") {
		super(message, 403);
	}
}
