const state = {
	fab: [],
};

const findRegisteredFabConfig = (fabConfigs, url) =>
	fabConfigs.find((siteConfig) => siteConfig.path === url);

const getters = {
	isFabVisible: (state) => (url) => !!findRegisteredFabConfig(state.fab, url),
	fabActions: (state) => (url) => {
		const config = findRegisteredFabConfig(state.fab, url);
		return config ? config.actions : [];
	},
};

const mutations = {
	registerFab(state, fabConfig) {
		if (!findRegisteredFabConfig(state.fab, fabConfig.path)) {
			state.fab.push(fabConfig);
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
