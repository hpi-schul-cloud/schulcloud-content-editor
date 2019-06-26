const state = {
	fab: [],
};

const findRegisteredFabConfig = (fabConfigs, url) =>
	fabConfigs.find((siteConfig) => siteConfig.path === url);

const getters = {
	GET_FAB_ACTIONS: (state) => (url) => {
		const config = findRegisteredFabConfig(state.fab, url);
		return config ? config.actions : [];
	},
};

const mutations = {
	REGISTER_FAB(state, fabConfig) {
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
