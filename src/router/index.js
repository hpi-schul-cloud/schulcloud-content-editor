import Vue from "vue";
import Router from "vue-router";

function loadView(path) {
	return () =>
		import(/* webpackChunkName: "view-[request]" */ `@/components/pages/${path}`);
}

Vue.use(Router);

export default new Router({
	mode: "history",
	routes: [
		{ path: "/", name: "main", component: loadView("overview/overview.vue") },
		{ path: "/stats", name: "stats", component: loadView("stats/stats.vue") },
		{ path: "/create", name: "create", component: loadView("edit/edit.vue") },
		{ path: "/edit/:id", name: "edit", component: loadView("edit/edit.vue") },
	],
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		}
		return { x: 0, y: 0 };
	},
});
