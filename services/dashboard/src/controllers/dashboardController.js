import { getDashboardService } from "../services/dashboardService.js";

export const getDashboardController = async (req, res, next) => {
	try {
		const userId = req.user.id;

		const dashboardData = await getDashboardService(userId);
		res.status(200).json(dashboardData);
	} catch (err) {
		next(err);
	}
};
