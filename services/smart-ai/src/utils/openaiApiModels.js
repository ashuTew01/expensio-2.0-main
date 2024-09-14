export const openaiModels = {
	"gpt-4o-2024-08-06": {
		name: "gpt-4o-2024-08-06",
		pricing: {
			input: 2.5,
			output: 10.0,
			perTokens: 1000000,
		},
	},
	"gpt-4o-mini": {
		name: "gpt-4o-mini",
		pricing: {
			input: 0.15,
			output: 0.6,
			perTokens: 1000000,
		},
	},
};

// List of valid OpenAI models (expand based on available models)
export const validModels = [...Object.keys(openaiModels)];
