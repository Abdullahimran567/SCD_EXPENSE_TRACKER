import { dashboardService } from "../services/dashboardService.js";
import { AppError } from "../utils/errors.js";

export const getDashboardSummary = async (req, res) => {
	try {
		const userId = req.user.id;
		const summaryData = await dashboardService.getDashboardSummary(userId);

		return res.status(200).json({
			success: true,
			user: summaryData.user,
			summary: summaryData,
		});
	} catch (error) {
		if (error instanceof AppError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.message,
			});
		}
		console.error("Error in getDashboardSummary:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to load dashboard summary",
			error: error.message,
		});
	}
};
