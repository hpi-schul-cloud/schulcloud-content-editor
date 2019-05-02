<template>
	<div>
		<Searchbar
			v-model.lazy="searchString"
			:label="$lang.resourceManagement.search.searchbar.label"
			:placeholder="$lang.resourceManagement.search.searchbar.placeholder"
		/>

		<p>
			{{ pagination.totalEntrys }}
			{{ $lang.resourceManagement.search.number_of_found_items }}.
		</p>

		<div v-show="resources.length">
			<ResourceBulkEdit
				:resources="resources"
				:resource-start-index="(pagination.page - 1) * pagination.itemsPerPage"
				:query="apiSearchQuery"
				@reload="loadContent"
			/>
			<Pagination :config="pagination" @pageChanged="handlePageChange" />
		</div>
		<p v-show="!resources.length">
			{{ $lang.resourceManagement.search.nothing_found }}
			<br />
			<small>
				{{ $lang.resourceManagement.search.nothing_found_help }}
			</small>
		</p>
	</div>
</template>

<script>
import Searchbar from "@/components/Searchbar";
import Pagination from "@/components/Pagination";
import ResourceBulkEdit from "@/components/resourceManagement/index/ResourceBulkEdit";

import api from "@/mixins/api.js";

export default {
	components: {
		Searchbar,
		Pagination,
		ResourceBulkEdit,
	},
	mixins: [api],
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
	computed: {
		apiSearchQuery() {
			return {
				$limit: this.pagination.itemsPerPage,
				$skip: this.pagination.itemsPerPage * (this.pagination.page - 1),
				"_all[$match]": this.searchString,
			};
		},
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
					title: this.$lang.resourceManagement.create,
					icon: "create",
					event: "navigate",
					payload: { name: "resourceManagement/create" },
				},
				{
					title: this.$lang.resourceManagement.import,
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
			// set unique browser url
			this.updateUrlQuery();

			if (this.searchString.length === 0) {
				this.apiSearchQuery["_all[$match]"] = undefined;
			}
			// build request url
			const request = this.$_resourceFind(this.apiSearchQuery);
			return request
				.then((data) => {
					this.resources = data.data;
					this.pagination.totalEntrys = data.total;
				})
				.catch((error) => {
					console.error(e);
					this.$toasted.error(error);
				});
		},
	},
};
</script>
