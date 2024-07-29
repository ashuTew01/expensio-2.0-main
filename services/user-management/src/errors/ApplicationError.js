export default class ApplicationError extends Error {
	constructor(message, statusCode) {
		super(message); // pass to Error class constructor
		this.name = this.constructor.name; //set error name to class name
		this.statusCode = statusCode;
	}
}
