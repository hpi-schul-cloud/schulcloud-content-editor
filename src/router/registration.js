import store from "../store/index";

export default [
	{
		path: "/registration",
		name: "userManagement/registration",
		component: "userManagement/registration",
		sidebarTitle: "Nutzerverwaltung",
		sidebarIcon: "supervisor_account",
		beforeEnter: (to, from, next) => {
			if (store.state.user.user.role === "User") {
				next(from);
			} else {
				next();
			}
		},
	},
];
