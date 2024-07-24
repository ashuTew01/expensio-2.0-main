import ApplicationError from "./ApplicationError.js";

export default class DatabaseError extends ApplicationError {
	constructor(message = "An error occurred with the database operation") {
		super(message, 500);
	}
}
