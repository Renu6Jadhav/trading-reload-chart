import stylistic from "@stylistic/eslint-plugin";
export default [
	{
		plugins: {
			"@stylistic": stylistic,
		},
		rules: {
			"@stylistic/padding-line-between-statements": [
				"error",
				{
					blankLine: "never",
					prev: "*",
					next: "*",
				},
			],
		},
	},
];
