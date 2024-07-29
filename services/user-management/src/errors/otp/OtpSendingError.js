import ApplicationError from "../ApplicationError.js";

export default class OtpSendingError extends ApplicationError {
	constructor(message = "Error sending OTP via SMS") {
		super(message, 503);
	}
}
