import { getAllExpenses } from "../models/expenseModel.js";
import {
	findCategoryByCode,
	findPsychologicalTypeByCode,
	findGoalById,
	createExpense,
	addExpenseToGoal,
} from "../services/databaseServices.js";

const getExpenses = async (req, res) => {
	try {
		const expenses = await getAllExpenses();
		res.json(expenses);
	} catch (error) {
		console.error("Error fetching expenses:", error);
		res.status(500).json({ message: "Failed to retrieve expenses." });
	}
};

const addExpense = async (req, res) => {
	const {
		title,
		amount,
		categoryCode,
		dateTime,
		event,
		psychologicalTypeCode,
		description,
		notes,
		image,
		paymentMethod,
		mood,
		goalId,
	} = req.body;
	const userId = req.user.id;

	try {
		if (!title || !amount || !categoryCode) {
			return res
				.status(400)
				.json({ message: "Title, amount, and category are required." });
		}

		const category = await findCategoryByCode(categoryCode);
		if (!category) {
			return res.status(400).json({ message: "Invalid category code." });
		}

		let psychologicalType = null;
		if (psychologicalTypeCode) {
			psychologicalType = await findPsychologicalTypeByCode(
				psychologicalTypeCode
			);
			if (!psychologicalType) {
				return res
					.status(400)
					.json({ message: "Invalid psychological type code." });
			}
		}

		let goal = null;
		if (goalId) {
			goal = await findGoalById(goalId);
			if (!goal) {
				return res.status(400).json({ message: "Invalid goal ID." });
			}
		}

		const newExpense = await createExpense({
			userId,
			title,
			amount,
			categoryId: category.id,
			dateTime: dateTime || new Date(),
			event,
			psychologicalTypeId: psychologicalType ? psychologicalType.id : null,
			description,
			notes,
			image,
			paymentMethod,
			mood: mood || "neutral",
			goalId: goal ? goal.id : null,
		});

		if (goal) {
			await addExpenseToGoal(goal.id, newExpense.id);
		}

		res.status(201).json({
			message: `Expense ${goal ? "and goal" : ""} added successfully!`,
			expense: newExpense,
		});
	} catch (error) {
		console.error("Failed to add expense:", error);
		res
			.status(500)
			.json({ message: "Failed to add expense due to internal server error." });
	}
};

export { getExpenses, addExpense };
