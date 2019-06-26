module.exports = {
	"*.html": ["yarn lint:prettier --write", "git add"],
	"*.js": ["yarn lint:eslint --fix", "yarn lint:prettier --write", "git add"],
	"{!(package)*.json,*.code-snippets,.*rc}": [
		"yarn lint:prettier --parser json",
		"git add",
	],
	"package.json": ["yarn lint:prettier --write", "git add"],
	"*.vue": [
		"yarn lint:eslint --fix",
		"yarn lint:stylelint --fix",
		"yarn lint:prettier --write",
		"git add",
	],
	"*.scss": [
		"yarn lint:stylelint --fix",
		"yarn lint:prettier --write",
		"git add",
	],
	"*.{png,jpeg,jpg,gif,svg}": ["imagemin-lint-staged", "git add"],
};
