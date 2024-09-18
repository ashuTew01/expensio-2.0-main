import dayjs from "dayjs"; // You can use any date formatting library like moment.js or dayjs

export const formatExpenseListData = (expensesData) => {
	return expensesData.map((expense, index) => ({
		id: expense._id, // Unique ID required by DataGrid
		serial: index + 1,
		title: expense.title || "No Title", // Ensure there's a title
		categoryName: expense.categoryId.name || "Uncategorized", // Extract category name
		amount: expense.amount || 0, // Extract amount
		dateNtime: dayjs(expense.createdAt).format("DD/MM/YYYY HH:mm:ss"), // Format date and time
		cognitiveTriggers: expense.cognitiveTriggerIds?.length
			? expense.cognitiveTriggerIds.map((trigger) => trigger.name).join(", ") // Join all cognitive trigger names
			: "No Triggers", // Handle if no triggers are available
		mood: expense.mood || "No Mood", // Handle if no mood is available
	}));
};

export const formatIncomeListData = (incomes) => {
	return incomes.map((income, index) => ({
		id: income._id,
		serial: index + 1, // Adding serial number
		title: income.title,
		categoryName: income.categoryId.name, // Using the nested category name
		amount: income.amount,
		dateNtime: dayjs(income.createdAt).format("DD/MM/YYYY HH:mm:ss"), // Formatting date and time
	}));
};
