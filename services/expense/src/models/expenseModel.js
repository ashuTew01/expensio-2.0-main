import dbPool from "../config/dbConfig.js";

export const getAllExpenses = async () => {
	const result = await dbPool.query("SELECT * FROM expenses");
	return result.rows;
};
