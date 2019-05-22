import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

const loadView = (path) => {
	return () =>
		import(/* webpackChunkName: "page-[request]" */ `@/pages/${path}`);
};

import resourceManagement from "./resourceManagement";
import statistics from "./statistics";

const routes = [
	{ path: "/", redirect: "/resources", name: "main" },
	// Plugins:
	...resourceManagement,
	...statistics,
	{
		path: "/registration",
		name: "registration",
		component: "registration.vue",
	},
	{
		path: "*",
		name: "404",
		component: "404.vue",
	},
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
