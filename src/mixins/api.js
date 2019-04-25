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
		async $_resourceBulkPatch(query, data = {}) {
			if (!query) {
				throw new Error("query (first) parameter is required!");
			}

			const cleanQuery = {};
			Object.entries(query).forEach(([key, value]) => {
				if (!["$limit", "$skip"].includes(key)) {
					cleanQuery[key] = value;
				}
			});
			cleanQuery["$limit"] = "-1";
			cleanQuery["$select"] = ["_id"];

			const idResponse = await this.$_resourceFind(cleanQuery);

			const ids = idResponse.map((resource) => resource._id);

			if (!window.confirm(`${ids.length} Einträge bearbeiten?`)) {
				throw new Error("Edit aborted.");
			}

			const queryString = qs.stringify({
				"_id[$in]": ids,
			});

			return jsonFetch(
				this.$config.API.contentServerUrl +
					this.$config.API.pushContentPath +
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
