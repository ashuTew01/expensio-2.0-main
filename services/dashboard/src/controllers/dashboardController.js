import Joi from "joi";
import { getDashboardService } from "../services/dashboardService.js";
import { logError, ValidationError } from "@expensio/sharedlib";

export const getDashboardController = async (req, res, next) => {
	try {
		const schema = Joi.object({
			userId: Joi.number().required(),
		});

		const { error } = schema.validate({ userId: req.user.id });

		if (error) {
			throw new ValidationError("Some query parameters are invalid.", error);
		}
		const dashboardData = await getDashboardService(req.user.id);
		res.status(200).json(dashboardData);
	} catch (err) {
		logError(
			`Failed to retrieve dashboard for user ${req.user.id}: ${err.message}`
		);
		next(err);
	}
};
