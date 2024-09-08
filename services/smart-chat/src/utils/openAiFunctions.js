import {
	expenseCategoryCodesEnum,
	expenseCategoryDescription,
	expenseCognitiveTriggerCodesEnum,
	expenseCognitiveTriggerDescription,
} from "../data/expenseModelData.js";

import {
	incomeCategoryCodesEnum,
	incomeCategoryDescription,
} from "../data/incomeModelData.js";

export const openAICreateExpenseFunction = [
	{
		name: "createExpense",
		description: "Creates 1 expense for the user.",
		parameters: {
			type: "object",
			properties: {
				title: {
					type: "string",
					description: "The title or name of the expense",
				},
				amount: {
					type: "number",
					description: "The amount spent on the expense, greater than 0.",
				},
				categoryCode: {
					type: "string",
					enum: expenseCategoryCodesEnum,
					description: expenseCategoryDescription,
				},
				expenseType: {
					type: "string",
					enum: ["necessity", "luxury", "investment", "saving"],
					description:
						"The type of the expense (necessity, luxury, investment, saving)",
				},
				isRecurring: {
					type: "boolean",
					description: "Whether the expense is recurring, like a subscription.",
				},
				notes: {
					type: "array",
					items: {
						type: "string",
					},
					description: "Optional notes for the expense",
				},
				cognitiveTriggerCodes: {
					type: "array",
					items: {
						type: "string",
						enum: expenseCognitiveTriggerCodesEnum,
					},
					description: expenseCognitiveTriggerDescription,
				},
				paymentMethod: {
					type: "string",
					enum: [
						"cash",
						"credit_card",
						"debit_card",
						"online_payment",
						"unknown",
					],
					description: "Payment method for the expense",
				},
				mood: {
					type: "string",
					enum: ["happy", "neutral", "regretful"],
					description: "Mood associated with the expense",
				},
			},
			required: ["title", "amount", "categoryCode", "expenseType"],
		},
	},
];

export const openAIGetFinancialDataFunction = [
	{
		name: "getFinancialData",
		description:
			"Retrieves the financial data for the user based on the specified months and year.",
		parameters: {
			type: "object",
			properties: {
				type: {
					type: "string",
					enum: ["expense", "income", "both"],
					description:
						"Type of financial data to retrieve: 'expense', 'income', or 'both'. If can't tell, default to 'both'",
				},
				monthYearPairs: {
					type: "array",
					items: {
						type: "object",
						properties: {
							month: {
								type: "number",
								description:
									"The month for which the financial data is requested (1-12).",
							},
							year: {
								type: "number",
								description:
									"The year for which the financial data is requested.",
							},
						},
						required: ["month", "year"],
					},
					description:
						"An array of month-year pairs representing the months and years for which financial data is requested.",
				},
			},
			required: ["type", "monthYearPairs"],
		},
	},
];

export const openAICreateIncomeFunction = [
	{
		name: "createIncome",
		description: "Creates 1 income entry for the user",
		parameters: {
			type: "object",
			properties: {
				title: {
					type: "string",
					description: "The title or name of the income source",
				},
				amount: {
					type: "number",
					description: "The amount of income received, must be greater than 0.",
				},
				categoryCode: {
					type: "string",
					enum: incomeCategoryCodesEnum,
					description: incomeCategoryDescription,
				},
				incomeType: {
					type: "string",
					enum: ["primary", "secondary", "settlement", "unknown"],
					description:
						"The type of the income (primary: main source, secondary: additional source, settlement: compensation received, unknown if unspecified)",
				},
				isRecurring: {
					type: "boolean",
					description:
						"Whether the income is recurring, like a salary or rental income.",
				},
				description: {
					type: "string",
					description: "Optional additional description of the income",
				},
			},
			required: ["title", "amount", "categoryCode", "incomeType"],
		},
	},
];

export const openAIGeneralFunctions = [
	{
		name: "createExpense",
		description:
			"Call if user wants to add an expense (only 1).If no amount given or title can't be inferred, ask for it. All the expense details must be given in single message.",
	},
	{
		name: "createIncome",
		description:
			"Call if user wants to add income (only 1).If no amount given or title can't be inferred, ask for it. All the income details must be given in single message.",
	},
	{
		name: "getFinancialData",
		description: "Call if user wants to fetch financial data.",
	},
	//   {
	//     name: "getFinancialSummary",
	//     description: "Call if user wants a financial summary.",
	//   },
];
