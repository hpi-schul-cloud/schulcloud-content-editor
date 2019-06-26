module.exports = {
	runtimeCompiler: true,
	publicPath: undefined,
	outputDir: undefined,
	assetsDir: undefined,
	productionSourceMap: undefined,
	parallel: undefined,

	css: {
		sourceMap: true,
	},

	publicPath: process.env.VUE_APP_PUBLIC_PATH || "/",

	pluginOptions: {
		i18n: {
			locale: "en",
			fallbackLocale: "en",
			localeDir: "../node_modules/@schul-cloud/rights-editor/src/locales",
			enableInSFC: true,
		},
	},
};
