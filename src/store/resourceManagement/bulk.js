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
	setVisibleColoumns(state, value) {
		state.visibleColoumns = value;
	},
	setBulkEnabled(state, value) {
		state.bulkEnabled = value;
	},
	setBulkAdvancedEnabled(state, value) {
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
