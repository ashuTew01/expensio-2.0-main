import Joi from "joi";
import { getDashboardService } from "../services/dashboardService.js";
import { logError } from "@expensio/sharedlib";

export const getDashboardController = async (req, res, next) => {
	const schema = Joi.object({
		userId: Joi.number().required(),
	});

	const { error } = schema.validate({ userId: req.user.id });

	if (error) {
		return res.status(400).json({ error: error.details[0].message });
	}

	try {
		const dashboardData = await getDashboardService(req.user.id);
		res.status(200).json(dashboardData);
	} catch (err) {
		logError(
			`Failed to retrieve dashboard for user ${req.user.id}: ${err.message}`
		);
		next(err);
	}
};
