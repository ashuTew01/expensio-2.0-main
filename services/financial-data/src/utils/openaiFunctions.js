export const generateFinancialSummaryFunction = {
	name: "generateFinancialSummary",
	description:
		"Generates comprehensive financial insights, personality assessments, and recommendations based on the user's financial data.",
	parameters: {
		type: "object",
		properties: {
			behavioralInsights: {
				type: "string",
				description:
					"Deep, novel analysis of the user's spending behaviors, including complex patterns not easily observed.",
			},
			personalityInsights: {
				type: "string",
				description:
					"Detailed assessment of the user's personality traits as they relate to financial habits.",
			},
			personalizedRecommendations: {
				type: "string",
				description:
					"Extremely detailed, personalized advice and messaging to help the user improve their financial habits.",
			},
			benchmarking: {
				type: "string",
				description:
					"Sophisticated comparison of the user's financial data against industry standards or averages.",
			},
		},
		required: [
			"behavioralInsights",
			"personalityInsights",
			"personalizedRecommendations",
			"benchmarking",
		],
	},
};
