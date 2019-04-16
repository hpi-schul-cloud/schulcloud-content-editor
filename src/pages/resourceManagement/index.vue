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

		<BaseTags
			v-model="visibleColoumns"
			label="Select Coloumns"
			:autocomplete-items="availableColoumns.map((a) => ({ text: a.key }))"
			:add-only-from-autocomplete="true"
		/>

		<ResourceEditTable
			v-if="resources.length"
			:resources="resources"
			:header-visible="true"
			:visible-coloumns="visibleColoumns"
			:index-start="(pagination.page - 1) * pagination.itemsPerPage"
			@patchResource="patchResource"
		/>
		<p v-else>
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
import Searchbar from "@/components/Searchbar.vue";
import BaseTags from "@/components/base/BaseTags.vue";
import ResourceEditTable, {
	availableColoumns,
} from "@/components/ResourceEditTable.vue";
import Pagination from "@/components/Pagination.vue";

import api from "@/mixins/api.js";

export default {
	name: "Overview",
	components: {
		Searchbar,
		BaseTags,
		ResourceEditTable,
		Pagination,
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
			availableColoumns,
			visibleColoumns: [
				"title",
				"isPublished",
				"contentCategory",
				"licenses",
				"description",
			],
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

			// build request url
			const request =
				this.searchString.length == 0
					? this.$_resourceGet()
					: this.$_resourceFind(apiSearchQuery);
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
		patchResource(resource) {
			const resourceViewIndex =
				(this.pagination.page - 1) * this.pagination.itemsPerPage +
				this.resources.indexOf(resource);
			return this.$_resourcePatch(resource)
				.then(() => {
					this.$toasted.show(`L${resourceViewIndex} - Saved`);
				})
				.catch((error) => {
					this.$toasted.error(`L${resourceViewIndex} - Failed to save`);
				});
		},
	},
};
</script>
