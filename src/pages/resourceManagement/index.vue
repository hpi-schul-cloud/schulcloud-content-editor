<template>
	<div>
		<Searchbar
			v-model.lazy="searchString"
			:label="$lang.resourceManagement.search.searchbar.label"
			:placeholder="$lang.resourceManagement.search.searchbar.placeholder"
		/>

		<FeathersFilter
			:handle-url="true"
			:consistent-order="true"
			:filter="filter"
			@newFilter="updateFilter"
			add-label="Filter hinzufügen"
			apply-label="Filtern"
			cancle-label="Abbrechen"
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
import Vue from "vue";
import FeathersFilter from "feathersjs-filter-ui";

Vue.use(FeathersFilter);

import Searchbar from "@/components/Searchbar";
import Pagination from "@/components/Pagination";
import ResourceBulkEdit from "@/components/resourceManagement/index/ResourceBulkEdit";

import api from "@/mixins/api.js";
import { mapMutations } from "vuex";

export default {
	components: {
		FeathersFilter,
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
			filter: [
				{
					type: "sort",
					title: "Sortieren nach",
					displayTemplate: "Sortieren nach: %1",
					options: Object.entries(this.$lang.resources),
					defaultSelection: "updatedAt",
					defaultOrder: "DESC",
				},
				{
					type: "limit",
					title: "Einträge pro Seite",
					displayTemplate: "Einträge pro Seite: %1",
					options: [10, 25, 50, 100, 250, 500],
					defaultSelection: 50,
				},
				{
					type: "boolean",
					title: "Status",
					options: {
						isPublished: this.$lang.resources.isPublished,
						isProtected: this.$lang.resources.isProtected,
					},
					applyNegated: {
						isPublished: [false, true],
						isProtected: [true, false],
					},
				},
			],
			filterQuery: {},
		};
	},
	computed: {
		apiSearchQuery() {
			return {
				...this.filterQuery,
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
					icon: "create",
					text: this.$lang.resourceManagement.create,
					event: "navigate",
					payload: { name: "resourceManagement/create" },
				},
				{
					icon: "import_export",
					text: this.$lang.resourceManagement.import,
					event: "navigate",
					payload: { name: "resourceManagement/import" },
				},
			],
		};
		this.registerFab(config);

		this.loadContent();
		window.onhashchange = this.handleUrlChange;
	},
	methods: {
		...mapMutations("ui", {
			registerFab: "REGISTER_FAB",
		}),
		updateFilter([feathersQuery, urlQuery]) {
			if (feathersQuery.$limit) {
				this.pagination.itemsPerPage = feathersQuery.$limit;
			}
			this.filterQuery = feathersQuery;
			this.loadContent();
		},
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
