const state = {
	bulkEnabled: false,
	bulkAdvancedEnabled: false,
	visibleColoumns: ["title", "description", "licenses", "tags", "isPublished"],
	activeFilters: [],
};

const getters = {
	visibleColoumns: (state) => state.visibleColoumns,
	bulkEnabled: (state) => state.bulkEnabled,
	bulkAdvancedEnabled: (state) => state.bulkAdvancedEnabled,
};

const mutations = {
	SET_VISIBLE_COLOUMNS(state, value) {
		state.visibleColoumns = value;
	},
	SET_BULK_ENABLED(state, value) {
		state.bulkEnabled = value;
	},
	SET_BULK_ADVANCED_ENABLED(state, value) {
		state.bulkAdvancedEnabled = value;
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
