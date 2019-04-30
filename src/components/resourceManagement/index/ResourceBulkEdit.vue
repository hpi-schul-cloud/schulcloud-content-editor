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
			@deleteResource="deleteResource"
			@patchBulk="patchBulk"
			@deleteBulk="deleteBulk"
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
import { setTimeout } from "timers";

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
	watch: {
		visibleColoumns: function(to, from) {
			Object.keys(this.bulkReplace).forEach((key) => {
				if (!this.visibleColoumns.includes(key)) {
					this.bulkReplace[key] = undefined;
					this.bulkFind[key] = undefined;
				}
			});
		},
	},
	methods: {
		updateResource(existing, newResource) {
			Object.entries(newResource).forEach(([key, value]) => {
				existing[key] = value;
			});
		},
		patchResource(resource) {
			const resourceViewIndex =
				this.resourceStartIndex + this.resources.indexOf(resource) + 1;
			return this.$_resourcePatch(resource)
				.then((result) => {
					this.$toasted.show(`L${resourceViewIndex} - Saved`);
					this.updateResource(resource, result);
				})
				.catch((error) => {
					console.error(error);
					this.$toasted.error(`L${resourceViewIndex} - Failed to save`);
				});
		},
		deleteResource(resource) {
			const resourceViewIndex =
				this.resourceStartIndex + this.resources.indexOf(resource) + 1;

			return this.$_resourceDelete(resource._id)
				.then((result) => {
					this.$toasted.show(`L${resourceViewIndex} - Deleted`);
					const index = this.resources.findIndex(
						(item) => item._id === resource._id
					);
					if (index !== -1) {
						this.resources.splice(index, 1);
					}
				})
				.catch((error) => {
					console.error(error);
					this.$toasted.error(`L${resourceViewIndex} - Failed to delete`);
				});
		},
		patchBulk(data) {
			const cleanedData = {};
			Object.entries(data).forEach(([key, value]) => {
				if (value !== undefined) {
					cleanedData[key] = value;
				}
			});

			return this.$_resourceBulkPatch(this.query, cleanedData)
				.then((results) => {
					this.$toasted.show(`Patched ${results.length} Resources`);
					const visibleIds = this.resources.map((r) => r._id);
					const visibleUpdatedResources = results.forEach((newResource) => {
						const visibileIndex = visibleIds.indexOf(newResource._id);
						if (visibileIndex === -1) {
							return;
						}
						this.updateResource(this.resources[visibileIndex], newResource);
					});
				})
				.catch((error) => {
					this.$toasted.error(
						error.message ? error.toString() : `Failed to Patch`
					);
				});
		},
		deleteBulk() {
			return this.$_resourceBulkDelete(this.query)
				.then((results) => {
					this.$toasted.show(`Deleted ${results.length} Resources`);
					setTimeout(() => {
						this.$emit("reload");
					}, 3000);
				})
				.catch((error) => {
					this.$toasted.error(
						error.message ? error.toString() : `Failed to Delete`
					);
				});
		},
	},
};
</script>
