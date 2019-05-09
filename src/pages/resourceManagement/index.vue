<template>
	<div>
		<Searchbar
			v-model.lazy="searchString"
			:label="$lang.resourceManagement.search.searchbar.label"
			:placeholder="$lang.resourceManagement.search.searchbar.placeholder"
		/>

		<FeathersFilter
			add-label="Filter hinzufügen"
			:filter="JSON.stringify(filter)"
			:handle-url="true"
			@newFilter="updateFilter"
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
					type: "select",
					title: "Multi Select",
					displayTemplate: "Selections: %1",
					property: "prop1",
					multiple: true,
					expanded: true,
					options: [
						["option-1", "option 1"],
						["option-2", "option 2"],
						["option-3", "option 3"],
						["option-4", "option 4"],
						["option-5", "option 5"],
						["option-6", "option 6"],
						["option-7", "option 7"],
						["option-8", "option 8"],
						["option-9", "option 9"],
					],
					defaultSelection: ["option-1", "option-2"],
				},
				{
					type: "select",
					title: "Single Select",
					displayTemplate: "Selection: %1",
					property: "prop2",
					multiple: false,
					expanded: true,
					options: [
						["option-1", "option 1"],
						["option-2", "option 2"],
						["option-3", "option 3"],
						["option-4", "option 4"],
					],
					defaultSelection: "option-3",
				},
				{
					type: "date",
					title: "Date From",
					displayTemplate: "Date starting at: %1",
					property: "createdAt",
					mode: "from",
				},
				{
					type: "date",
					title: "Date from to",
					displayTemplate: "Date from: %1 to: %2",
					property: "updatedAt",
					mode: "fromto",
					defaultFromDate: new Date(),
					defaultToDate: new Date(),
				},
				{
					type: "sort",
					title: "Sort",
					displayTemplate: "sort by: %1",
					options: [["createdAt", "created"], ["updatedAt", "updated"]],
					defaultSelection: "updatedAt",
					defaultOrder: "DESC",
				},
				{
					type: "limit",
					title: "$limit",
					displayTemplate: "Items per page: %1",
					options: [10, 25, 50, 100, 250, 500],
					defaultSelection: 25,
				},
				{
					type: "boolean",
					title: "Boolean",
					options: {
						publicSubmissions: "Public submissions",
						teamSubmissions: "Team submissions",
					},
					defaultSelection: {
						publicSubmissions: true,
					},
					applyNegated: {
						teamSubmissions: [true, true],
					},
				},
			],
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
