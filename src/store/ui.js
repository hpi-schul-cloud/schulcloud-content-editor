const state = {
	fab: [],
	sidebar: [
		{
			title: "overview",
			icon: "home",
			to: {
				name: "resourceManagement",
			},
		},
		{
			title: "Statistics",
			icon: "import_export",
			to: {
				name: "statistics",
			},
		},
	],
};

const findRegisteredFabConfig = (fabConfigs, url) =>
	fabConfigs.find((siteConfig) => siteConfig.path === url);

const getters = {
	isFabVisible: (state) => (url) => !!findRegisteredFabConfig(state.fab, url),
	fabActions: (state) => (url) => {
		const config = findRegisteredFabConfig(state.fab, url);
		return config ? config.actions : [];
	},
	getSidebar: (state) => state.sidebar,
};

const mutations = {
	registerFab(state, fabConfig) {
		if (!findRegisteredFabConfig(state.fab, fabConfig.path)) {
			state.fab.push(fabConfig);
		}
	},
	registerSidebar(state, sidebarConfig) {
		if (
			!state.sidebar.find(
				(sidebarEntry) => sidebarEntry.title === sidebarConfig.title
			)
		) {
			state.sidebar.push(sidebarConfig);
		}
	},
};

const actions = {};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
