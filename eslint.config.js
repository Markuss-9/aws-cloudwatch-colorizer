const js = require('@eslint/js');
const jsdoc = require('eslint-plugin-jsdoc');
const globals = require('globals');

// import js from '@eslint/js';
// import jsdoc from "eslint-plugin-jsdoc";
// import globals from "globals";

module.exports = [
	js.configs.recommended,
	jsdoc.configs['flat/recommended'],
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				...globals.browser,
				myCustomGlobal: 'readonly',
			},
		},
		plugins: { jsdoc: jsdoc },
		rules: {
			'jsdoc/check-values': 1,
			complexity: ['warn', { max: 10 }],
		},
	},
	{
		files: ['tests/**/*'],
		languageOptions: {
			globals: {
				jest: 'readonly',
			},
		},
		env: {
			jest: true,
		},
	},
];
