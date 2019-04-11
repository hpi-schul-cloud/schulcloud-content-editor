<template>
	<div>
		<Searchbar
			v-model.lazy="searchString"
			:label="$lang.searchContent.searchbar.label"
			:placeholder="$lang.searchContent.searchbar.placeholder"
		/>
		<ResourceEditTable
			:resources="resources"
			:index-start="(pagination.page - 1) * pagination.itemsPerPage"
		/>
		<Pagination :config="pagination" @pageChanged="handlePageChange" />
	</div>
</template>

<script>
import qs from "query-string";

import Searchbar from "@/components/Searchbar.vue";
import ResourceEditTable from "@/components/ResourceEditTable.vue";
import Pagination from "@/components/Pagination.vue";

export default {
	name: "Overview",
	components: {
		Searchbar,
		ResourceEditTable,
		Pagination,
	},
	data() {
		return {
			searchString: this.$route.query.q || "",
			pagination: {
				page: parseInt(this.$route.query.p) || 1,
				itemsPerPage: 50,
				totalEntrys: 0,
				buttonRange: 2,
				scroll: {
					top: 0,
					left: 0,
					behavior: "smooth",
				},
			},
			resources: [],
		};
	},
	watch: {
		searchString: function(to, from) {
			if (to === from) {
				return;
			}
			if (from != "") {
				this.pagination.page = 1;
			}
			this.loadContent();
		},
		"pagination.page": function(to, from) {
			if (to === from) {
				return;
			}
			this.loadContent();
		},
		"pagination.itemsPerPage": function(to, from) {
			if (to === from) {
				return;
			}
			this.pagination.page = 1;
			this.loadContent();
		},
	},
	created() {
		const config = {
			path: this.$route.path,
			actions: [
				{
					title: "Inhalt erstellen",
					icon: "create",
					event: "navigate",
					payload: { name: "resourceManagement/create" },
				},
				{
					title: "Inhalte importieren",
					icon: "import_export",
					event: "navigate",
					payload: { name: "resourceManagement/import" },
				},
			],
		};
		this.$store.commit("ui/registerFab", config);

		this.loadContent();
		window.onhashchange = this.handleUrlChange;
	},
	methods: {
		handlePageChange(page) {
			this.pagination.page = page;
			this.loadContent();
		},
		handleUrlChange() {
			this.searchString = this.$route.query.q;
			this.pagination.page = parseInt(this.$route.query.p);
		},
		updateUrlQuery() {
			this.$router.push({
				query: {
					q: this.searchString || "",
					p: this.pagination.page || 1,
				},
			});
		},
		loadContent() {
			// clear data to show "loading state"
			this.resources = [];

			// set unique browser url
			this.updateUrlQuery();

			// build request query params
			const apiSearchQuery = {
				$limit: this.pagination.itemsPerPage,
				$skip: this.pagination.itemsPerPage * (this.pagination.page - 1),
				"_all[$match]": this.searchString,
			};
			const apiSearchQueryString = qs.stringify(apiSearchQuery);

			// build request url
			const path =
				this.searchString.length == 0
					? this.$config.API.getContentPath
					: `${this.$config.API.searchContentPath}?${apiSearchQueryString}`;

			// fetch new data
			this.$http
				.get(this.$config.API.serverServerUrl + path, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("jwt")}`,
					},
				})
				.then((response) => {
					this.resources = response.data.data;
					this.pagination.totalEntrys = response.data.total;
				})
				.catch((e) => {
					// TODO: show error to user
					console.error(e);
				});
		},
	},
};
</script>
