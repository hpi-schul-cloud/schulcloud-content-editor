<template>
	<div>
		<BaseCheckbox v-model="bulkEdit" label="Bulk Edit" />
		<BaseCheckbox
			v-if="bulkEdit"
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
			:bulk-inputs="bulkInput"
			:resources="resources"
			:header-visible="true"
			:visible-coloumns="visibleColoumns"
			:index-start="resourceStartIndex"
			@patchResource="patchResource"
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
		resource[coloumn] = undefined;
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
			bulkEdit: false,
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
		bulkInput() {
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
	},
};
</script>
