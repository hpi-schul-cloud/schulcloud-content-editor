import { jsonFetch } from "@/mixins/api.js";
import configFile from "@/config";
import { stat } from "fs";

const state = {
	jwt: undefined,
	user: {},
	users: [],
};

const getters = {
	GET_JWT: (state) => state.jwt,
	GET_USER: (state) => state.user,
	GET_USERS: (state) => state.users,
};

const mutations = {
	_SET_JWT(state, jwt) {
		state.jwt = jwt;
	},
	_SET_USER(state, user) {
		state.user = user;
	},
	_SET_USERS(state, users) {
		state.users = users;
	},
	_UPDATE_USER(state, user) {
		const userIndex = state.users.findIndex((a) => {
			return user._id == a._id;
		});
		state.users[userIndex] = user;
	},
	_REMOVE_USER(state, user) {
		const userIndex = state.users.findIndex((a) => {
			return user._id == a._id;
		});
		state.users.splice(userIndex, 1);
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
			configFile.API.contentServerUrl + configFile.API.authPath,
			{
				method: "POST",
				body: data,
			}
		);

		localStorage.setItem("jwt", accessToken); // TODO refactor jsonFetch so we don't need localStorage anymore
		const { userId } = decodeJwt(accessToken);

		const user = await jsonFetch(
			configFile.API.contentServerUrl + configFile.API.userInfoPath + userId
		);

		commit("_SET_JWT", accessToken);
		commit("_SET_USER", user);
	},
	async REGISTER_USER({ commit }, data) {
		return new Promise((resolve, reject) => {
			jsonFetch(configFile.API.contentServerUrl + configFile.API.userInfoPath, {
				method: "POST",
				body: data,
			}).then(
				(response) => {
					resolve(response);
				},
				(error) => {
					reject(error);
				}
			);
		});
	},
	async REGISTER_PROVIDER({ commit }, data) {
		return new Promise((resolve, reject) => {
			jsonFetch(
				configFile.API.contentServerUrl + configFile.API.getProviderPath,
				{
					method: "POST",
					body: data,
				}
			).then(
				(response) => {
					resolve(response);
				},
				(error) => {
					reject(error);
				}
			);
		});
	},
	LOGOUT({ commit }) {
		commit("_SET_JWT", undefined);
		commit("_SET_USER", undefined);
		localStorage.clear();
	},
	async FETCH_USERS({ commit }, data) {
		return jsonFetch(
			configFile.API.contentServerUrl + configFile.API.userInfoPath
		).then((result) => {
			commit("_SET_USERS", result.data);
			return result.data;
		});
	},
	async PATCH_USER({ commit }, data) {
		return jsonFetch(
			configFile.API.contentServerUrl + configFile.API.userInfoPath + data._id,
			{
				method: "PATCH",
				body: data,
			}
		).then((result) => {
			commit("_UPDATE_USER", result);
			return result;
		});
	},
	async REMOVE_USER({ commit }, data) {
		return jsonFetch(
			configFile.API.contentServerUrl + configFile.API.userInfoPath + data._id,
			{
				method: "DELETE",
			}
		).then((result) => {
			commit("_REMOVE_USER", data);
			return result.data;
		});
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
