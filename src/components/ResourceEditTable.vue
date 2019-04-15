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
				<tr v-for="(row, rowIndex) in resources" :key="row._id">
					<td v-for="(coloumn, coloumnIndex) in visibleColoumns" :key="coloumn">
						<form v-if="coloumnIndex === 0" :id="getFormId(rowIndex)"></form>
						<component
							:is="getComponent(coloumn).component"
							v-model="row[coloumn]"
							:form="getFormId(rowIndex)"
							:label="coloumn"
							:name="coloumn"
							v-bind="getComponent(coloumn).attributes"
						/>
					</td>
					<td>
						<BaseButton
							type="submit"
							:form="getFormId(rowIndex)"
							class="action"
						>
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
		<p v-else>Nothing found :(</p>
	</div>
</template>

<script>
import { options as MimeTypeOptions } from "@/components/inputs/ContentMimetype.vue";
import { options as CategoryOptions } from "@/components/inputs/ContentCategory.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseTags from "@/components/base/BaseTags.vue";
import TableCheckbox from "@/components/EditTable/TableCheckbox.vue";
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
	{
		key: "contentCategory",
		component: TableSelect,
		attributes: { options: CategoryOptions },
	},
	{ key: "description", component: TableInput, attributes: {} },
	{ key: "isPublished", component: TableCheckbox, attributes: {} },
	{ key: "url", component: TableInput, attributes: { type: "url" } },
	{ key: "thumbnail", component: TableInput, attributes: { type: "url" } },
	{ key: "licenses", component: TableTags, attributes: {} },
];

export default {
	components: {
		BaseTags,
		BaseButton,
		TableInput,
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
			visibleColoumns: ["title", "isPublished", "contentCategory", "licenses"],
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
		getFormId(index) {
			return `table-form-${index}`;
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
