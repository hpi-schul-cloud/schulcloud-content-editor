<template>
	<div>
		<Searchbar
			v-model.lazy="searchString"
			:label="$lang.resourceManagement.search.searchbar.label"
			:placeholder="$lang.resourceManagement.search.searchbar.placeholder"
		/>
		<div v-if="hasDefaultQuery" class="remove-predefined-filter">
			<i class="material-icons">warning</i>

			Aufgrund von vordefinierten Filtern siehst du nur einen Teil der Daten.
			<router-link :to="{ name: 'resourceManagement' }" @click="loadContent()">
				<BaseButton :raised="true" styling="primary">
					alle Inhalte anzeigen
				</BaseButton>
			</router-link>
		</div>
		<VueFilterUi
			:filter="$_filterConfig"
			:parser="parser"
			@newQuery="updateFilter"
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
import VueFilterUi, { parser } from "vue-filter-ui";
import Searchbar from "@/components/Searchbar";
import Pagination from "@/components/Pagination";
import ResourceBulkEdit from "@/components/resourceManagement/index/ResourceBulkEdit";
import BaseButton from "@/components/base/BaseButton";

import filter from "@/mixins/resourceFilter.js";
import api from "@/mixins/api.js";
import { mapMutations } from "vuex";

export default {
	components: {
		BaseButton,
		VueFilterUi,
		Searchbar,
		Pagination,
		ResourceBulkEdit,
	},
	mixins: [api, filter],
	props: {
		defaultQuery: {
			type: Object,
			default: () => ({}),
		},
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
			parser: parser.FeathersJS,
			filterQuery: {},
		};
	},
	computed: {
		hasDefaultQuery() {
			return !!Object.keys(this.defaultQuery).length;
		},
		apiSearchQuery() {
			return {
				...this.defaultQuery,
				...this.filterQuery,
				$limit: this.pagination.itemsPerPage,
				$skip: this.pagination.itemsPerPage * (this.pagination.page - 1),
				"_all[$match]": this.searchString,
			};
		},
	},
	watch: {
		defaultQuery: function() {
			this.loadContent();
		},
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
		updateFilter(feathersQuery) {
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

<style lang="scss" scoped>
.remove-predefined-filter {
	display: flex;
	align-items: center;
	float: right;
	i {
		margin-right: 0.5rem;
	}
}
</style>
