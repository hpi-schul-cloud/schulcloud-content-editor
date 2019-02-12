import Vue from "vue";
import Router from "vue-router";
import config from "../config.js";

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
		{
			path: "/create",
			name: "create",
			component: loadView("edit/edit.vue"),
			beforeEnter: (to, from, next) => {
				fetch(
					config.configs.API.contentServerUrl +
						config.configs.API.postReserveId,
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${localStorage.getItem("jwt")}`,
						},
					}
				)
					.then((response) => {
						return response.json();
					})
					.then((data) => {
						next({
							path: "/" + data._id + "/create",
							component: loadView("edit/edit.vue"),
							props: { editMode: false },
						});
					})
					.catch((error) => {
						console.error(error);
					});
			},
		},
		{
			path: "/:id/create",
			name: "createWithID",
			component: loadView("edit/edit.vue"),
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
