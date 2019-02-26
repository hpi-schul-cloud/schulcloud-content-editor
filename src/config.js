// mymodule.js
export default {
	configs: {
		API: {
			serverServerUrl:
				process.env.VUE_APP_SERVER_SERVER_URL || "http://127.0.0.1:3030",
			contentServerUrl:
				process.env.VUE_APP_CONTENT_SERVER_URL || "http://127.0.0.1:4040",
			authPath: "/authentication",
			pwRecoveryPath: "/login?recovery=true",
			userInfoPath: "/users/",
			getContentPath: "/content/resources/",
			postReserveId: "/reserved_Ids",
			getFiletreePath: "/files/structure/",
			pushContentPath: "/resources/",
			searchContentPath: "/content/search/",
			viewContentPath: "/content/redirect/",
			hostingEntry: "/files/get/",
		},
		card: {
			displayedTags: 9,
		},
	},
};
