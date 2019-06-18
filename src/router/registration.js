import store from "../store/index";

export default [
	{
		path: "/users/registration",
		name: "userManagement/registration",
		component: "userManagement/registration",
		beforeEnter: (to, from, next) => {
			if ((store.getters["user/GET_USER"] || {}).role === "user") {
				next(from);
			} else {
				next();
			}
		},
	},
	{
		path: "/users",
		name: "userManagement",
		component: "userManagement/index",
		sidebarTitle: "Nutzerverwaltung",
		sidebarIcon: "supervisor_account",
		beforeEnter: (to, from, next) => {
			if ((store.getters["user/GET_USER"] || {}).role === "user") {
				next(from);
			} else {
				next();
			}
		},
	},
];
