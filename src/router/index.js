import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

const loadView = (path) => {
	return () =>
		import(/* webpackChunkName: "page-[request]" */ `@/pages/${path}`);
};

import resourceManagement from "./resourceManagement";
import statistics from "./statistics";
import video from "./video";

const routes = [
	{ path: "/", redirect: "/resources", name: "main" },
	// Plugins:
	...resourceManagement,
	...statistics,
	...video,
];

export default new Router({
	mode: "history",
	base: process.env.VUE_APP_PUBLIC_PATH || "/",
	routes: routes.map((route) => {
		if (route.component) {
			route.component = loadView(route.component);
		}
		return route;
	}),
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		}
		return { x: 0, y: 0 };
	},
});
