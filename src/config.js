// mymodule.js
export default {
	API: {
		serverServerUrl:
			process.env.VUE_APP_SERVER_SERVER_URL || "http://127.0.0.1:3030",
		contentServerUrl:
			process.env.VUE_APP_CONTENT_SERVER_URL || "http://127.0.0.1:4040",
		authPath: "/authentication",
		pwRecoveryPath: "/login?recovery=true",
		userInfoPath: "/users/",
		getContentPath: "/resources/",
		getFiletreePath: "/files/structure/",
		pushContentPath: "/resources/",
		pushBulkContentPath: "/resources/bulk/",
		searchContentPath: "/search/",
		viewContentPath: "/content/redirect/",
		fileUploadPath: "/files/upload/",
		hostingEntry: "/files/get/",
	},
	card: {
		displayedTags: 9,
	},
};
