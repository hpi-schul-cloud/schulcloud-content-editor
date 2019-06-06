<template>
	<div>
		<Searchbar
			v-model.lazy="searchString"
			:label="$lang.resourceManagement.search.searchbar.label"
			:placeholder="$lang.resourceManagement.search.searchbar.placeholder"
		/>

		<VueFilterUi
			:filter="filter"
			:parser="parser"
			@newFilter="updateFilter"
			label-add="Filter hinzufügen"
			label-apply="Filtern"
			label-cancle="Abbrechen"
			label-remove="Entfernen"
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
import VueFilterUi, { parser, inputs } from "vue-filter-ui";
import Searchbar from "@/components/Searchbar";
import Pagination from "@/components/Pagination";
import ResourceBulkEdit from "@/components/resourceManagement/index/ResourceBulkEdit";

import api from "@/mixins/api.js";
import { mapMutations } from "vuex";

export default {
	components: {
		VueFilterUi,
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
			parser: parser.FeathersJS,
			filter: [
				{
					title: "Einträge pro Seite",
					chipTemplate: "Einträge pro Seite: %1",
					required: true,
					filter: [
						{
							attribute: "$limit",
							operator: "=",
							input: inputs.Radio,
							options: [
								{ value: 10, label: "10" },
								{ value: 25, label: "25" },
								{ value: 50, label: "50" },
								{ value: 100, label: "100" },
								{ value: 250, label: "250" },
								{ value: 500, label: "500" },
							],
						},
					],
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
					console.error(error);
					this.$toasted.error(error);
				});
		},
	},
};
</script>
