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
};
