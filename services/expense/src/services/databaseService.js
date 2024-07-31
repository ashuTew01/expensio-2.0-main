// src/services/databaseServices.js
import { query } from "../utils/database.js";

export const findCategoryByCode = async (code) => {
	const result = await query("SELECT * FROM categories WHERE code = $1", [
		code,
	]);
	return result.rows[0];
};

export const findPsychologicalTypeByCode = async (code) => {
	const result = await query(
		"SELECT * FROM psychological_types WHERE code = $1",
		[code]
	);
	return result.rows[0];
};

export const findGoalById = async (id) => {
	const result = await query("SELECT * FROM goals WHERE id = $1", [id]);
	return result.rows[0];
};

export const createExpense = async (expenseData) => {
	const {
		userId,
		title,
		amount,
		categoryId,
		dateTime,
		event,
		psychologicalTypeId,
		description,
		notes,
		image,
		paymentMethod,
		mood,
		goalId,
	} = expenseData;
	const sql = `
        INSERT INTO expenses (user_id, title, amount, category_id, date_time, event, psychological_type_id, description, notes, image, payment_method, mood, goal_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *;
    `;
	const params = [
		userId,
		title,
		amount,
		categoryId,
		dateTime,
		event,
		psychologicalTypeId,
		description,
		notes,
		image,
		paymentMethod,
		mood,
		goalId,
	];
	const result = await query(sql, params);
	return result.rows[0];
};

export const addExpenseToGoal = async (goalId, expenseId) => {
	const sql =
		"UPDATE goals SET expenses = array_append(expenses, $1) WHERE id = $2";
	const params = [expenseId, goalId];
	await query(sql, params);
};
