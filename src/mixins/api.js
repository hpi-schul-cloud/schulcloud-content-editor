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

	return fetch(url, Object.assign({}, defaultConfig, config))
		.then((res) => res.json())
		.then((res) => {
			if (res.code < 200 || res.code >= 300) {
				throw new Error(res.message);
			}
			return res;
		});
};

export const unpaginateQuery = (query) => {
	const cleanQuery = Object.assign({}, query, {
		$limit: "-1",
	});
	delete cleanQuery["$skip"];
	return cleanQuery;
};

export default {
	methods: {
		async $_login(data) {
			return jsonFetch(
				this.$config.API.serverServerUrl + this.$config.API.authPath,
				{
					method: "POST",
					body: data,
				}
			);
		},
		async $_userGet(userId) {
			return jsonFetch(
				this.$config.API.serverServerUrl +
					this.$config.API.userInfoPath +
					userId
			);
		},
		async $_resourceGet(resourceId) {
			return jsonFetch(
				this.$config.API.contentServerUrl +
					this.$config.API.getContentPath +
					(resourceId ? resourceId : "")
			);
		},
		async $_resourceFind(query) {
			const queryString = qs.stringify(query);

			return jsonFetch(
				this.$config.API.contentServerUrl +
					this.$config.API.searchContentPath +
					"?" +
					queryString
			);
		},
		async $_resourceFindAmount(query) {
			const newQuery = {
				...unpaginateQuery(query),
				$select: [],
			};
			const queryResult = await this.$_resourceFind(newQuery);
			return queryResult.length;
		},
		async $_resourceCreate(resource) {
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
		async $_resourcePatch(resource) {
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
		async $_resourceDelete(resourceId) {
			return jsonFetch(
				this.$config.API.contentServerUrl +
					this.$config.API.pushContentPath +
					resourceId,
				{
					method: "DELETE",
				}
			);
		},
		async $_resourceFilesGet(resourceId) {
			return jsonFetch(
				this.$config.API.contentServerUrl +
					this.$config.API.getFiletreePath +
					resourceId
			);
		},
		async $_resourceResourceSchemaGet() {
			return jsonFetch(
				this.$config.API.contentServerUrl + "/resources/resource-schema"
			);
		},
		async $_resourceBulkCreate(resource) {
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

			const queryString = qs.stringify(unpaginateQuery(query));

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
		async $_resourceBulkDelete(query) {
			if (!query) {
				throw new Error("query (first) parameter is required!");
			}

			const queryString = qs.stringify(unpaginateQuery(query));

			return jsonFetch(
				this.$config.API.contentServerUrl +
					this.$config.API.pushBulkContentPath +
					"?" +
					queryString,
				{
					method: "DELETE",
				}
			);
		},
	},
};
