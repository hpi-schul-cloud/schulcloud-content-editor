export default [
	{
		path: "/resources",
		name: "resourceManagement",
		component: "resourceManagement/index.vue",
		sidebarTitle: "Verwaltung",
		sidebarIcon: "home",
	},
	{
		path: "/resources/create",
		name: "resourceManagement/create",
		component: "resourceManagement/edit.vue", // resourceManagement/create.vue
		props: { editMode: false },
	},
	{
		path: "/resources/import",
		name: "resourceManagement/import",
		component: "resourceManagement/import.vue",
		props: { editMode: false },
	},
	{
		path: "/resources/:id",
		name: "resourceManagement/edit",
		component: "resourceManagement/edit.vue",
		props: { editMode: true },
	},
];
