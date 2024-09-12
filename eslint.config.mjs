import globals from "globals";
import pluginJs from "@eslint/js";

export default [
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
	},
	pluginJs.configs.recommended,
	{
		// Custom rules
		rules: {
			// Rule to prevent using undefined variables
			"no-undef": "error", // Ensures all variables must be defined or imported

			// Optionally disable unused vars warning for function arguments with "_"
			"no-unused-vars": [
				"warn",
				{ vars: "all", args: "after-used", argsIgnorePattern: "^_" },
			],
		},
	},
];
