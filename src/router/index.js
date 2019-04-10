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
	base: process.env.BASE || "/",
	routes: [
		{ path: "/", name: "main", component: loadView("overview/overview.vue") },
		{ path: "/stats", name: "stats", component: loadView("stats/stats.vue") },
		{
			path: "/create",
			name: "create",
			component: loadView("edit/edit.vue"),
			props: { editMode: false },
		},
		{
			path: "/edit/:id",
			name: "edit",
			component: loadView("edit/edit.vue"),
			props: { editMode: true },
		},
	],
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		}
		return { x: 0, y: 0 };
	},
});
