<template>
	<div>
		<BaseCheckbox v-model="bulkEdit" label="Bulk Edit" />
		<BaseCheckbox
			v-if="bulkEdit && false"
			v-model="bulkAdvanced"
			label="Advanced Bulk Edit"
		/>
		<BaseTags
			v-model="visibleColoumns"
			label="Select Coloumns"
			:autocomplete-items="availableColoumns.map((a) => ({ text: a.key }))"
			:add-only-from-autocomplete="true"
		/>

		<ResourceEditTable
			:bulk-inputs="bulkInputs"
			:resources="resources"
			:header-visible="true"
			:visible-coloumns="visibleColoumns"
			:index-start="resourceStartIndex"
			@patchResource="patchResource"
			@patchBulk="patchBulk"
		/>
	</div>
</template>

<script>
import BaseCheckbox from "@/components/base/BaseCheckbox";
import BaseTags from "@/components/base/BaseTags";
import ResourceEditTable, {
	availableColoumns,
} from "@/components/resourceManagement/index/ResourceEditTable";

import api from "@/mixins/api.js";

const emptyResource = (name) => {
	const resource = { name };
	availableColoumns.forEach((coloumn) => {
		resource[coloumn.key] = undefined;
	});
	return resource;
};

export default {
	components: {
		BaseCheckbox,
		BaseTags,
		ResourceEditTable,
	},
	mixins: [api],
	props: {
		query: {
			type: Object,
			default: () => {},
		},
		resources: {
			type: Array,
			default: () => [],
		},
		resourceStartIndex: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			bulkEdit: true,
			bulkAdvanced: false,
			bulkReplace: emptyResource("Edit"),
			bulkFind: emptyResource("Filter"),
			availableColoumns,
			visibleColoumns: [
				"title",
				"isPublished",
				"contentCategory",
				"licenses",
				"description",
			],
		};
	},
	computed: {
		bulkInputs() {
			const inputRows = [];
			if (this.bulkEdit) {
				inputRows.push(this.bulkReplace);
			}
			if (this.bulkAdvanced) {
				inputRows.push(this.bulkFind);
			}
			return inputRows;
		},
	},
	methods: {
		patchResource(resource) {
			const resourceViewIndex =
				this.resourceStartIndex + this.resources.indexOf(resource) + 1;
			return this.$_resourcePatch(resource)
				.then(() => {
					this.$toasted.show(`L${resourceViewIndex} - Saved`);
				})
				.catch((error) => {
					this.$toasted.error(`L${resourceViewIndex} - Failed to save`);
				});
		},
		patchBulk(data) {
			const cleanedData = {};
			Object.entries(data).forEach(([key, value]) => {
				if ((value && value.length > 0) || typeof value === "boolean") {
					cleanedData[key] = value;
				}
			});

			const cleanQuery = {};
			Object.entries(this.query).forEach(([key, value]) => {
				if (!["$limit", "$skip"].includes(key)) {
					cleanQuery[key] = value;
				}
			});

			return this.$_resourceBulkPatch(cleanQuery, cleanedData)
				.then((result) => {
					this.$toasted.show(`Patched ${result.length} Resources`);
				})
				.catch((error) => {
					console.error(error);
					this.$toasted.error(`Failed to Patch`);
				});
		},
	},
};
</script>
