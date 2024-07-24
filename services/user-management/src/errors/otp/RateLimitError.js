import ApplicationError from "../ApplicationError.js";

export default class RateLimitError extends ApplicationError {
	constructor(message = "Rate limit exceeded") {
		super(message, 429);
	}
}
