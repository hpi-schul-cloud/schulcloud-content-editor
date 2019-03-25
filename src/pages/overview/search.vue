<template>
	<div class="wrapper">
		<!--<md-field id="search-input">
        <label>{{$lang.searchContent.search_for}}</label>
        <md-input v-model="searchQuery"></md-input>
    </md-field>-->
		<div id="search-input">
			<input
				id="search-query-input"
				v-model.lazy="searchQuery"
				:placeholder="$lang.searchContent.search_for + '...'"
			/>
			<br />
			<span v-if="searchQuery" id="result-headline">
				<b>{{ pagination.totalEntrys }}</b>
				{{ $lang.searchContent.searchResults_for }}
				<b>"{{ searchQuery }}"</b>
			</span>
		</div>

		<div class="md-layout">
			<SearchFilter @newFilter="updateFilter" />
		</div>
		<div class="flex">
			<div v-if="readOnly != true">
				<BaseButton :toggled="gutter" @ButtonClicked="gutter = true">
					{{ $lang.buttons.card }}
				</BaseButton>
				<BaseButton
					:toggled="!gutter"
					@ButtonClicked="
						gutter = false;
						tableEnabled = true;
					"
				>
					{{ $lang.buttons.list }}
				</BaseButton>
			</div>
			<div class="items-per-page-picker">
				<BaseSelect
					:label="$lang.searchContent.items_per_page"
					name="itemsPerPage"
					:options="entry_options"
					:selected="pagination.itemsPerPage.toString()"
					@input="pagination.itemsPerPage = parseInt($event)"
				/>
			</div>
		</div>
		<div v-show="gutter" class="grid">
			<div
				v-for="item in data"
				:key="item._id + '#card'"
				class="card-wrapper grid-xs-12 grid-s-6 grid-m-6 grid-l-4 grid-xl-3 height-100"
			>
				<ContentCard :data="item" :read-only="readOnly" class="height-100" />
			</div>
		</div>
		<table v-show="!gutter" v-if="tableEnabled && readOnly != true">
			<thead>
				<tr>
					<th>{{ $lang.edit.form.title }}</th>
					<th>{{ $lang.edit.form.url }}</th>
					<th class="hide-s">{{ $lang.edit.form.license }}</th>
					<th class="hide-m">{{ $lang.edit.form.categorie }}</th>
				</tr>
			</thead>
			<ContentRow
				v-for="item in data"
				:key="item._id + '#table'"
				:content-data="item"
				@delete="deleteEntry"
			/>
		</table>
		<MdEmptyState
			v-if="data.length == 0"
			class="md-primary"
			md-icon="error_outline"
			:md-label="$lang.searchContent.nothing_found"
			:md-description="$lang.searchContent.nothing_found_help"
		/>
		<Pagination :config="pagination" @pageChanged="pageChanged" />
	</div>
</template>

<script>
import ContentCard from "@/components/contentCard.vue";
import Pagination from "@/components/pagination.vue";
import SearchFilter from "./filter.vue";
import ContentRow from "./editForm-table.vue";
import BaseSelect from "@/components/base/BaseSelect.vue";
import BaseButton from "@/components/base/BaseButton.vue";

const qs = require("query-string");

export default {
	name: "ContentList",
	components: {
		ContentCard,
		Pagination,
		ContentRow,
		SearchFilter,
		BaseSelect,
		BaseButton,
	},
	props: {
		readOnly: {
			type: Boolean,
		},
	},
	data() {
		return {
			data: [],
			gutter: true,
			tableEnabled: false,
			searchQuery: "",
			apiFilterQuery: {},
			urlQuery: {},
			pagination: {
				page: 1,
				itemsPerPage: 12,
				totalEntrys: 0,
				buttonRange: 2,
				scroll: {
					top: 0,
					left: 0,
					behavior: "smooth",
				},
			},
			entry_options: [
				{ key: "12", value: 12 },
				{ key: "24", value: 24 },
				{ key: "48", value: 48 },
				{ key: "96", value: 96 },
			],
		};
	},
	watch: {
		searchQuery(to, from) {
			if (to != from) {
				if (from != "") {
					this.pagination.page = 1;
				}
				this.loadContent();
			}
		},
		"pagination.page": function(to, from) {
			if (to != from) {
				this.loadContent();
			}
		},
		"pagination.itemsPerPage": function(to, from) {
			if (to != from) {
				this.pagination.page = 1;
				this.loadContent();
			}
		},
	},
	created() {
		if (this.$router) {
			this.searchQuery = this.$route.query.q || "";
			this.pagination.page = parseInt(this.$route.query.p) || 1;
		} else {
			const query = qs.parse(location.search) || {};
			this.searchQuery = query.q || "";
			this.pagination.page = parseInt(query.p) || 1;
		}
		this.loadContent();
		window.onhashchange = this.urlChangeHandler;
	},
	methods: {
		pageChanged(page) {
			this.pagination.page = page;
			this.loadContent();
		},
		updateURL(newQuery) {
			if (this.$router) {
				this.$router.push({ query: newQuery });
			} else if (history.pushState) {
				const newurl = `${window.location.protocol}//${window.location.host}${
					window.location.pathname
				}?${qs.stringify(newQuery)}`;
				window.history.pushState({ path: newurl }, "", newurl);
			}
		},
		loadContent() {
			// clear data to show "loading state"
			const page = this.pagination.page || 1; // pagination for request
			const searchString = this.searchQuery || ""; // query for search request

			// set unique url
			this.urlQuery.q = searchString;
			this.urlQuery.p = page;
			this.updateURL(this.urlQuery);

			// build request path and fetch new data
			const searchQuery = {
				$limit: this.pagination.itemsPerPage,
				$skip: this.pagination.itemsPerPage * (page - 1),
				"_all[$match]": searchString,
			};

			const queryString = qs.stringify(
				Object.assign(searchQuery, this.apiFilterQuery)
			);
			const path =
				searchString.length == 0
					? this.$config.API.getContentPath
					: `${this.$config.API.searchContentPath}?${queryString}`;
			this.$http
				.get(this.$config.API.serverServerUrl + path, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("jwt")}`,
					},
				})
				.then((response) => {
					this.data = response.data.data;
					this.pagination.totalEntrys = response.data.total;
				})
				.catch((e) => {
					console.error(e); // eslint-disable-line no-console
				});
		},
		urlChangeHandler() {
			// handle url changes
			if (this.$router) {
				this.searchQuery = this.$route.query.q;
				this.pagination.page = parseInt(this.$route.query.p);
			} else {
				const query = qs.parse(location.search);
				if (this.searchQuery != query.q) {
					this.searchQuery = query.q;
				}
				if (this.pagination.page != parseInt(query.p)) {
					this.pagination.page = parseInt(query.p);
				}
			}
		},
		updateFilter(newApiQuery, newUrlQuery) {
			this.apiFilterQuery = newApiQuery;
			this.urlQuery = newUrlQuery;
			this.loadContent();
		},
		deleteEntry(id) {
			this.data.forEach((entry, index) => {
				if (entry._id == id) {
					this.data.splice(index, 1);
				}
			});
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrapper {
	margin: 30px 5% 0 5%;
}
.date-picker {
	display: inline-flex;
}

.clear-date-picker {
	margin-top: 7px;
}

.items-per-page-picker {
	float: right;
	max-width: 200px;
	margin: 0 8px;
}

.md-layout {
	width: 100%;
	margin-bottom: 5px;
}

.md-layout-item {
	margin-right: 5px;
}

.card-wrapper {
	box-sizing: border-box;
	padding: 5px;
}

table {
	width: 100%;
}

.flex {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin: 1em 0;
}

#search-input {
	float: left;
	width: calc(100% - 200px);
	margin-top: 16px;
	margin-bottom: 16px;
	font-size: 1.75em !important;
	#search-query-input {
		display: inline-block;
		width: 100%;
		max-width: 500px;
		padding: 0;
		margin: 0;
		margin-left: 5px;
		font-size: 1em;
		line-height: 1em;
		color: inherit;
		background: transparent;
		border: none;
		border-bottom: 1px solid grey;
		outline: none;
		&:focus {
			color: var(--md-theme-default-primary);
			border-bottom: 1px solid var(--md-theme-default-primary);
		}
	}
	#result-headline {
		display: block;
		font-size: 1rem;
	}
}
</style>
