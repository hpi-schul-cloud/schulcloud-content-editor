import qs from "query-string";

export default {
	methods: {
		$_login(data) {
			return this.$http.post(
				this.$config.API.serverServerUrl + this.$config.API.authPath,
				data
			);
		},
		$_userGet(userId) {
			return this.$http.get(
				this.$config.API.serverServerUrl +
					this.$config.API.userInfoPath +
					userId,
				{
					headers: {
						Authorization: `Bearer ${jwt}`,
					},
				}
			);
		},
		$_resourceGet(resourceId) {
			return this.$http.get(
				this.$config.API.serverServerUrl +
					this.$config.API.getContentPath +
					(resourceId ? resourceId : ""),
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("jwt")}`,
					},
				}
			);
		},
		$_resourceFind(query) {
			const queryString = qs.stringify(query);
			return this.$http.get(
				this.$config.API.serverServerUrl +
					this.$config.API.searchContentPath +
					"?" +
					queryString,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("jwt")}`,
					},
				}
			);
		},
		$_resourceCreate(resource) {
			return this.$http.post(
				this.$config.API.contentServerUrl + this.$config.API.pushContentPath,
				resource,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("jwt")}`,
					},
				}
			);
		},
		$_resourcePatch(resource) {
			return this.$http.patch(
				this.$config.API.contentServerUrl +
					this.$config.API.pushContentPath +
					resource._id,
				resource,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("jwt")}`,
					},
				}
			);
		},
		$_resourceDelete(resourceId) {
			return this.$http.delete(
				this.$config.API.contentServerUrl +
					this.$config.API.pushContentPath +
					resourceId,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("jwt")}`,
					},
				}
			);
		},
		$_resourceFilesGet(resourceId) {
			return this.$http.get(
				this.$config.API.contentServerUrl +
					this.$config.API.getFiletreePath +
					resourceId,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("jwt")}`,
					},
				}
			);
		},
	},
};
