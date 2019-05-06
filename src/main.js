// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import "./registerServiceWorker";
import store from "./store";

// Global event bus
Vue.prototype.$eventHub = new Vue();

// PortalVue
import PortalVue from "portal-vue";
Vue.use(PortalVue);

// Toasts
import Toasted from "vue-toasted";
const toastOptions = {
	position: "bottom-left",
	duration: 5000,
};
Vue.use(Toasted, toastOptions);

// FAB
import VueFab from "vue-float-action-button";
Vue.use(VueFab, {
	iconType: "MaterialDesign",
});

// Cookie access
import VueCookies from "vue-cookies";
Vue.use(VueCookies);

// global config file
import VueConfig from "vue-config";
const configFile = require("./config");
Vue.use(VueConfig, configFile.default);

// language files
import VueLang from "vuejs-localization";
VueLang.requireAll(require.context("./lang", true, /\.js$/));
Vue.use(VueLang, { default: "de" });

// Progressbar
import VueProgressBar from "vue-progressbar";
const progressbarOptions = {
	color: "#ffffff",
	failedColor: "#874b4b",
	thickness: "5px",
	transition: {
		speed: "1s",
		opacity: "0.3s",
		termination: 400,
	},
	autoRevert: true,
	location: "top",
	inverse: false,
};
Vue.use(VueProgressBar, progressbarOptions);

// Vue Config
Vue.config.silent = false;
Vue.config.performance = true;
Vue.config.productionTip = false;

new Vue({
	el: "#app",
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");
