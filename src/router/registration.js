import store from "../store/index";

export default [
	{
		path: "/registration",
		name: "userManagement/registration",
		component: "userManagement/registration",
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
