<template>
	<div>
		<BaseTags
			v-model="visibleColoumns"
			label="Select Coloumns"
			:autocomplete-items="availableColoumns.map((a) => ({ text: a.key }))"
			:add-only-from-autocomplete="true"
		/>
		<table v-if="resources.length" class="table edit sticky">
			<thead>
				<tr>
					<th v-for="coloumn in visibleColoumns" :key="coloumn">
						{{ coloumn }}
					</th>
					<th>
						Actions
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="row in resources" :key="row._id">
					<td v-for="coloumn in visibleColoumns" :key="coloumn">
						<component
							:is="getComponent(coloumn).component"
							v-model="row[coloumn]"
							:label="coloumn"
							:name="coloumn"
							v-bind="getComponent(coloumn).attributes"
						/>
					</td>
					<td>
						<BaseButton class="action">
							<i class="material-icons">
								check
							</i>
						</BaseButton>
						<RouterLink
							class="action"
							:to="{ name: 'resourceManagement/edit', params: { id: row._id } }"
						>
							<i class="material-icons">
								edit
							</i>
						</RouterLink>
					</td>
				</tr>
			</tbody>
		</table>
		<!--
			<HotTable v-if="resources.length" :settings="hotSettings" />
		-->
		<p v-else>Nothing found :(</p>
	</div>
</template>

<script>
//import { HotTable } from "@handsontable/vue";
import Handsontable from "handsontable";

import { options as MimeTypeOptions } from "@/components/inputs/ContentMimetype.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseTags from "@/components/base/BaseTags.vue";
import TableInput from "@/components/EditTable/TableInput.vue";
import TableSelect from "@/components/EditTable/TableSelect.vue";
import TableTags from "@/components/EditTable/TableTags.vue";

const availableColoumns = [
	{ key: "title", component: TableInput, attributes: { type: "text" } },
	{ key: "tags", component: TableTags, attributes: {} },
	{
		key: "mimeType",
		component: TableSelect,
		attributes: { options: MimeTypeOptions },
	},
	/*
	{ key: "contentCategory", component: BaseSelect, attributes: {} },
	{ key: "description", component: BaseInput, attributes: {} },
	{ key: "isPublished", component: BaseCheckbox, attributes: {} },
	{ key: "licenses", component: BaseTags, attributes: {} },
	{
		key: "mimeType",
		component: BaseSelect,
		attributes: { options: MimeTypeOptions },
	},
	{ key: "tags", component: BaseTags, attributes: {} },
	{ key: "thumbnail", component: BaseInput, attributes: {} },
	{ key: "title", component: BaseInput, attributes: {} },
	{ key: "url", component: BaseInput, attributes: {} },
	*/
];

export default {
	components: {
		BaseTags,
		BaseButton,
		TableInput,
		//HotTable,
	},
	props: {
		resources: {
			type: Array,
			required: true,
		},
		indexStart: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			availableColoumns,
			visibleColoumns: ["title", "mimeType"], //, "url", "contentCategory", "tags"],
		};
	},
	computed: {
		hotSettings() {
			return {
				data: this.resources,
				//colHeaders: Object.keys(this.resources[0]),
				columns: [
					{ title: "Titel", data: "title" },
					{ title: "URL", data: "url" },
				],
				licenseKey: "non-commercial-and-evaluation", // TODO
				manualColumnMove: true,
				manualColumnResize: true,
				selectionMode: "single",
				disableVisualSelection: ["area", "header"],
				fillHandle: false,
				enterBeginsEditingBoolean: true,
			};
		},
	},
	methods: {
		getComponent(key) {
			return availableColoumns.find((coloumn) => coloumn.key === key);
		},
	},
};
</script>

<!--
<style src="handsontable/dist/handsontable.full.css"></style>
-->

<style lang="scss" scoped>
.table {
	width: 100%;
	// table-layout: fixed;
	border-collapse: collapse;
	td {
		max-width: 200px;
		padding: 0 4px;
		overflow: hidden;
		overflow-x: auto;
		white-space: nowrap;
		border: 1px solid #333;
	}
	tbody tr {
		&:nth-of-type(2n) {
			background-color: #eee;
		}
		&:hover {
			background-color: #ddd;
		}
	}
}
table.sticky {
	th {
		position: sticky;
		font-size: 1.1em;
		background: #fff;
	}
	thead th {
		top: 0;
	}
}
table.edit {
	td {
		&:focus-within {
			box-shadow: inset 0 0 0 2px var(--primaryColor);
		}
	}
	.action {
		padding: 0;
	}
}
</style>
