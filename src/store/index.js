import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import createPersistedState from "vuex-persistedstate";
import ui from "./ui";

export default new Vuex.Store({
	plugins: [
		/* createPersistedState() */
	],
	modules: {
		ui,
	},
});
