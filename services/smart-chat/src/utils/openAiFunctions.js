import {
	expenseCategoryCodesEnum,
	expenseCategoryDescription,
	expenseCognitiveTriggerCodesEnum,
	expenseCognitiveTriggerDescription,
} from "../data/expenseModelData.js";

export const openAICreateExpenseFunction = [
	{
		name: "createExpense",
		description: "Creates an expense for the user",
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

export const openAIGeneralFunctions = [
	{
		name: "createExpense",
		description:
			"Call if user wants to add an expense. If no amount given or title can't be inferred, ask for it. All the expense details must be given in single message.",
	},
	//   {
	//     name: "createIncome",
	//     description: "Call if user wants to add income.",
	//   },
	//   {
	//     name: "getFinancialData",
	//     description: "Call if user wants to fetch financial data.",
	//   },
	//   {
	//     name: "getFinancialSummary",
	//     description: "Call if user wants a financial summary.",
	//   },
];
