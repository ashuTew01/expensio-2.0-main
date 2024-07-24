import logger from "../config/logger.js";

const errorHandlingMiddleware = (err, req, res, next) => {
	logger.error(`${err.name}: ${err.message}`, {
		url: req.originalUrl,
		body: req.body,
		errorStack: err.stack,
	});

	const statusCode = err.statusCode || 500;
	const message =
		err.publicMessage || err.message || "An internal server error occurred";

	res.status(statusCode).json({ error: message });
};

export default errorHandlingMiddleware;
