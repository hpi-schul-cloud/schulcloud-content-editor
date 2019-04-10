import Vue from "vue";
import Router from "vue-router";
import config from "../config.js";

function loadView(path) {
	return () =>
		import(/* webpackChunkName: "view-[request]" */ `@/pages/${path}`);
}

Vue.use(Router);

export default new Router({
	mode: "history",
	routes: [
		// entrypoint
		{ path: "/", redirect: "/resources", name: "main" },
		// resources Plugin
		{
			path: "/resources",
			name: "resourceManagement",
			component: loadView("resourceManagement/index.vue"),
			sidebarTitle: "Verwaltung",
			sidebarIcon: "home",
		},
		{
			path: "/resources/create",
			name: "resourceManagement/create",
			component: loadView("resourceManagement/edit.vue"), // resourceManagement/create.vue
			props: { editMode: false },
		},
		{
			path: "/resources/import",
			name: "resourceManagement/import",
			component: loadView("resourceManagement/import.vue"),
			props: { editMode: false },
		},
		{
			path: "/resources/:id",
			name: "resourceManagement/edit",
			component: loadView("resourceManagement/edit.vue"),
			props: { editMode: true },
		},
		// Stats
		{
			path: "/statistics",
			name: "statistics",
			component: loadView("statistics/index.vue"),
			sidebarTitle: "Statistiken",
			sidebarIcon: "timeline",
		},
	],
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		}
		return { x: 0, y: 0 };
	},
});
