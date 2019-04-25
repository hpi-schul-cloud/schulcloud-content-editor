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

	return fetch(url, Object.assign({}, defaultConfig, config)).then((res) =>
		res.json()
	);
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
				this.$config.API.contentServerUrl +
					this.$config.API.getContentPath +
					(resourceId ? resourceId : "")
			);
		},
		$_resourceFind(query) {
			const queryString = qs.stringify(query);

			return jsonFetch(
				this.$config.API.contentServerUrl +
					this.$config.API.searchContentPath +
					"?" +
					queryString
			);
		},
		$_resourceCreate(resource) {
			if (Array.isArray(resource)) {
				return this.$_resourceBulkCreate(resource);
			}
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
		$_resourceResourceSchemaGet() {
			return jsonFetch(
				this.$config.API.contentServerUrl + "/resources/resource-schema"
			);
		},
		$_resourceBulkCreate(resource) {
			return jsonFetch(
				this.$config.API.contentServerUrl +
					this.$config.API.pushBulkContentPath,
				{
					method: "POST",
					body: resource,
				}
			);
		},
		async $_resourceBulkPatch(query, data = {}) {
			if (!query) {
				throw new Error("query (first) parameter is required!");
			}

			const cleanQuery = Object.assign({}, query, {
				$limit: "-1",
				$select: ["_id"],
			});
			delete cleanQuery["$skip"];

			const queryString = qs.stringify(cleanQuery);

			const queryResult = await this.$_resourceFind(cleanQuery);

			if (!window.confirm(`${queryResult.length} Einträge bearbeiten?`)) {
				throw new Error("Edit aborted.");
			}

			return jsonFetch(
				this.$config.API.contentServerUrl +
					this.$config.API.pushBulkContentPath +
					"?" +
					queryString,
				{
					method: "PATCH",
					body: data,
				}
			);
		},
	},
};
