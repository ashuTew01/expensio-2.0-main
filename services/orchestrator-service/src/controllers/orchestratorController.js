// import { startUserDeletionSaga } from "../services/orchestratorService.js";

export const initiateUserDeletion = async (req, res) => {
	try {
		const { userId } = req.body;
		// await startUserDeletionSaga(userId);
		res.status(200).json({ message: "User deletion process started." });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
