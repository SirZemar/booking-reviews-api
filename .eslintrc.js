module.exports = {
	root: true,
	env: {
		es6: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:import/typescript",
		"google",
		"plugin:@typescript-eslint/recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: ["tsconfig.json", "tsconfig.dev.json"],
		sourceType: "module",
	},
	ignorePatterns: [
		"/dist/**/*", // Ignore built files.
	],
	plugins: ["@typescript-eslint", "import"],
	rules: {
		"quotes": ["error", "double"],
		"import/no-unresolved": 0,
		"indent": ["error", "tab"],
		"no-tabs": 0,
		"object-curly-spacing": [2, "always"],
		"max-len": [
			1,
			{
				ignoreComments: true,
				ignoreStrings: true,
				ignoreUrls: true,
			},
		],
		"new-cap": [0],
	},
};
