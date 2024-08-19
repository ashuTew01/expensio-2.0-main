import { getFinancialData } from "../services/financialDataService.js";

export const fetchFinancialData = async (req, res) => {
    try {
        const { userId } = req.params;
        const data = await getFinancialData(userId);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
