/**
 * Formats an array of financial data objects into a string summary.
 *
 * @param {Array<Object>} expenseDataArray - An array of expense financial data objects.
 * @param {Array<Object>} incomeDataArray - An array of income financial data objects.
 * @returns {string} A string summary of the financial data.
 */
export const formatFinancialData = (expenseDataArray, incomeDataArray) => {
	let summary = "Currency: Rupees\n";

	// Process income data if available
	if (incomeDataArray && incomeDataArray.length > 0) {
		incomeDataArray.forEach((incomeData) => {
			if (incomeData) {
				summary += `\nIncome Data Month(${incomeData.month}/${incomeData.year}): TotalEarned ${incomeData.totalMoneyEarned}, TotalEntries ${incomeData.totalIncomes}\n`;

				if (incomeData.categories && incomeData.categories.length > 0) {
					summary += "Categories:\nCatName,TotalAmtEarned,NumEntries\n";
					incomeData.categories.forEach((cat) => {
						if (cat) {
							summary += `${cat.categoryName},${cat.totalAmountEarned},${cat.numIncomes}\n`;
						}
					});
				}
			}
		});
	}

	// Process expense data if available
	if (expenseDataArray && expenseDataArray.length > 0) {
		expenseDataArray.forEach((expenseData) => {
			if (expenseData) {
				summary += `\nExpenses Data Month(${expenseData.month}/${expenseData.year}): TotalSpent ${expenseData.totalMoneySpent}, TotalEntries ${expenseData.totalExpenses}\n`;

				// Categories
				if (expenseData.categories && expenseData.categories.length > 0) {
					summary += "Categories:\nCatName,TotalAmtSpent,NumEntries\n";
					expenseData.categories.forEach((cat) => {
						if (cat) {
							summary += `${cat.categoryName},${cat.totalAmountSpent},${cat.numExpenses}\n`;
						}
					});
				}

				// Cognitive Triggers
				if (
					expenseData.cognitiveTriggers &&
					expenseData.cognitiveTriggers.length > 0
				) {
					summary +=
						"CognitiveTriggers:\nTriggerName,TotalAmtSpent,NumEntries\n";
					expenseData.cognitiveTriggers.forEach((trigger) => {
						if (trigger) {
							summary += `${trigger.cognitiveTriggerName},${trigger.totalAmountSpent},${trigger.numExpenses}\n`;
						}
					});
				}

				// Moods
				if (expenseData.moods && expenseData.moods.length > 0) {
					summary += "Moods:\nMood,TotalAmtSpent,NumEntries\n";
					expenseData.moods.forEach((mood) => {
						if (mood) {
							summary += `${mood.mood},${mood.totalAmountSpent},${mood.numExpenses}\n`;
						}
					});
				}
			}
		});
	}

	// If no data is available
	if (summary === "Currency: Rupees\n") {
		summary = "No financial data available.";
	}

	return summary;
};
