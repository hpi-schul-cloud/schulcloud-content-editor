import { jsonFetch } from "@/mixins/api.js";
import configFile from "@/config";

const state = {
	jwt: undefined,
	user: {},
};

const getters = {
	getJwt: (state) => state.jwt,
	getUser: (state) => state.user,
};

const mutations = {
	setJwt(state, jwt) {
		state.jwt = jwt;
	},
	setUser(state, user) {
		state.user = user;
	},
};

const decodeJwt = (jwt) => {
	const base64Url = jwt.split(".")[1];
	const base64 = base64Url.replace("-", "+").replace("_", "/");
	return JSON.parse(window.atob(base64));
};

const actions = {
	async login({ commit }, data) {
		const { accessToken } = await jsonFetch(
			configFile.API.serverServerUrl + configFile.API.authPath,
			{
				method: "POST",
				body: data,
			}
		);

		localStorage.setItem("jwt", accessToken); // TODO refactor jsonFetch so we don't need localStorage anymore
		const { userId } = decodeJwt(accessToken);

		const user = await jsonFetch(
			configFile.API.serverServerUrl + configFile.API.userInfoPath + userId
		);

		commit("setJwt", accessToken);
		commit("setUser", user);
	},
	logout({ commit }) {
		commit("setJwt", undefined);
		commit("setUser", undefined);
		localStorage.clear();
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
