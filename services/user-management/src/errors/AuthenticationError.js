import ApplicationError from "./ApplicationError.js";

export default class AuthenticationError extends ApplicationError {
	constructor(message = "Authentication failed") {
		super(message, 401);
	}
}
