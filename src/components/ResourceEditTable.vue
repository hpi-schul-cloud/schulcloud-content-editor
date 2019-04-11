<template>
	<div>
		<BaseTags
			v-model="visibleColoumns"
			label="Select Coloumns"
			:autocomplete-items="availableColoumns.map((a) => ({ text: a }))"
			:add-only-from-autocomplete="true"
		/>
		<HotTable v-if="resources.length" :settings="hotSettings" />
		<p v-else>Nothing found :(</p>
	</div>
</template>

<script>
import { HotTable } from "@handsontable/vue";
import Handsontable from "handsontable";

import { options as MimeTypeOptions } from "@/components/inputs/ContentMimetype.vue";
import BaseTags from "@/components/base/BaseTags.vue";

const availableColoumns = ["title", "url", "tags"];
/*
const availableColoumns = [
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
];
*/

export default {
	components: {
		BaseTags,
		HotTable,
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
			visibleColoumns: ["title"], //, "url", "contentCategory", "tags"],
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
		getColoumnComponent(key) {
			return availableColoumns.find((coloumn) => coloumn.key === key);
		},
	},
};
</script>

<style src="handsontable/dist/handsontable.full.css"></style>

<style lang="scss" scoped>
/*
.table {
	width: 100%;
	// table-layout: fixed;
	border-collapse: collapse;
	td {
		padding: 2px 4px;
		overflow-x: auto;
		white-space: nowrap;
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
}
*/
</style>
