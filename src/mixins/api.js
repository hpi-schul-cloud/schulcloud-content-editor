import qs from "query-string";

const jsonFetch = (url, config = {}) => {
	const defaultConfig = {
		headers: {
			"Content-Type": "application/json",
		},
	};

	const jwt = localStorage.getItem("jwt");
	if (jwt) {
		defaultConfig.headers["Authorization"] = `Bearer ${jwt}`;
	}

	if (typeof config.body === "object") {
		config.body = JSON.stringify(config.body);
	}

	return fetch(url, { ...defaultConfig, ...config }).then((res) => res.json());
};

export default {
	methods: {
		$_login(data) {
			return jsonFetch(
				this.$config.API.serverServerUrl + this.$config.API.authPath,
				{
					method: "POST",
					body: data,
				}
			);
		},
		$_userGet(userId) {
			return jsonFetch(
				this.$config.API.serverServerUrl +
					this.$config.API.userInfoPath +
					userId
			);
		},
		$_resourceGet(resourceId) {
			return jsonFetch(
				this.$config.API.serverServerUrl +
					this.$config.API.getContentPath +
					(resourceId ? resourceId : "")
			);
		},
		$_resourceFind(query) {
			const queryString = qs.stringify(query);

			return jsonFetch(
				this.$config.API.serverServerUrl +
					this.$config.API.searchContentPath +
					"?" +
					queryString
			);
		},
		$_resourceCreate(resource) {
			return jsonFetch(
				this.$config.API.contentServerUrl + this.$config.API.pushContentPath,
				{
					method: "POST",
					body: resource,
				}
			);
		},
		$_resourcePatch(resource) {
			return jsonFetch(
				this.$config.API.contentServerUrl +
					this.$config.API.pushContentPath +
					resource._id,
				{
					method: "PATCH",
					body: resource,
				}
			);
		},
		$_resourceDelete(resourceId) {
			return jsonFetch(
				this.$config.API.contentServerUrl +
					this.$config.API.pushContentPath +
					resourceId,
				{
					method: "DELETE",
				}
			);
		},
		$_resourceFilesGet(resourceId) {
			return jsonFetch(
				this.$config.API.contentServerUrl +
					this.$config.API.getFiletreePath +
					resourceId
			);
		},
	},
};
