// Auth Middleware
import { logError } from "@expensio/sharedlib";

const guestResetMiddleware = (req, res, next) => {
	try {
		const token = req.header("Authorization")?.replace("Bearer ", "");
		if (token === process.env.GUEST_RESET_TOKEN) {
			next();
		} else {
			throw new Error("Guest User Reset Token Invalid");
		}
	} catch (error) {
		logError(`Bad Token. \n ${error}`);

		res.status(401).json({ error: error.message });
	}
};

export default guestResetMiddleware;
