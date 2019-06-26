import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

const loadView = (path) => {
	return () =>
		import(/* webpackChunkName: "page-[request]" */ `@/pages/${path}`);
};

import resourceManagement from "./resourceManagement";
import statistics from "./statistics";
import registration from "./registration";
import { routes as LicenseRoutes } from "@schul-cloud/rights-editor/src/router";

const routes = [
	{ path: "/", redirect: "/resources", name: "main" },
	// Plugins:
	...resourceManagement,
	...statistics,
	...registration,
	{
		path: "/licenses",
		component: "licenses/index.vue",
		sidebarTitle: "Lizenzen",
		sidebarIcon: "gavel",
		children: LicenseRoutes.map((route) => {
			if (route.path === "/") {
				route.name = "RightsEditor";
			}
			route.path = route.path.slice(1);
			return route;
		}),
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
