export default {
	methods: {
		$_get(query) {
			return this.$http.get(this.$config.API.serverServerUrl + path, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("jwt")}`,
				},
			});
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
	},
};
