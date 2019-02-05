module.exports = {
	"root": true,
	"env": {
		"node": true
	},
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/recommended'
  ],
  rules: {
    // override/add rules settings here, such as:
		// 'vue/no-unused-vars': 'error'
		"vue/component-name-in-template-casing": ["error", "PascalCase", { // https://vuejs.github.io/eslint-plugin-vue/rules/component-name-in-template-casing.html
			"ignores": []
		}],
		/*"vue/script-indent": ["error", "tab", { // https://vuejs.github.io/eslint-plugin-vue/rules/script-indent.html
			"baseIndent": 0,
			"switchCase": 0,
			"ignores": []
		}]*/
	},
	"parserOptions": {
		"parser": "babel-eslint"
	}
}