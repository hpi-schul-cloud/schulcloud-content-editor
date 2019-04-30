<template>
	<div>
		<Searchbar
			v-model.lazy="searchString"
			:label="$lang.search.searchbar.label"
			:placeholder="$lang.search.searchbar.placeholder"
		/>

		<p>
			{{ pagination.totalEntrys }} {{ $lang.search.number_of_found_items }}.
		</p>

		<ResourceBulkEdit
			v-show="true || resources.length"
			:resources="resources"
			:resource-start-index="(pagination.page - 1) * pagination.itemsPerPage"
			:query="apiSearchQuery"
			@reload="loadContent"
		/>
		<p v-show="!resources.length">
			{{ $lang.search.nothing_found }}
			<br />
			<small>
				{{ $lang.search.nothing_found_help }}
			</small>
		</p>
		<Pagination :config="pagination" @pageChanged="handlePageChange" />
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
			//this.resources = []; // TODO add loading animation/transition

			// set unique browser url
			this.updateUrlQuery();

			// build request url
			const request =
				this.searchString.length === 0
					? this.$_resourceGet()
					: this.$_resourceFind(this.apiSearchQuery);
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
