import { jsonFetch } from "@/mixins/api.js";
import configFile from "@/config";

const state = {
	jwt: undefined,
	user: {},
};

const getters = {
	GET_JWT: (state) => state.jwt,
	GET_USER: (state) => state.user,
};

const mutations = {
	SET_JWT(state, jwt) {
		state.jwt = jwt;
	},
	SET_USER(state, user) {
		state.user = user;
	},
};

const decodeJwt = (jwt) => {
	const base64Url = jwt.split(".")[1];
	const base64 = base64Url.replace("-", "+").replace("_", "/");
	return JSON.parse(window.atob(base64));
};

const actions = {
	async LOGIN({ commit }, data) {
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

		commit("SET_JWT", accessToken);
		commit("SET_USER", user);
	},
	LOGOUT({ commit }) {
		commit("SET_JWT", undefined);
		commit("SET_USER", undefined);
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
