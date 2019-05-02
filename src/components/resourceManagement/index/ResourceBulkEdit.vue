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

		<ResourceBulkEditTable
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
import ResourceBulkEditTable, {
	availableColoumns,
} from "@/components/resourceManagement/index/ResourceBulkEditTable";

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
		ResourceBulkEditTable,
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
			bulkAdvanced: true,
			bulkReplace: emptyResource("Ersetzen"),
			bulkFind: emptyResource("Suchen"),
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
		// HELPER
		getResourceIndex(resource) {
			const resourceIndex = this.resources.findIndex(
				(item) => item._id === resource._id
			);
			if (resourceIndex === -1) {
				throw new Error("Item to delete not found.", resource);
			}
			return resourceIndex;
		},
		getResourceSearchIndex(resource) {
			return this.resourceStartIndex + this.resources.indexOf(resource) + 1;
		},
		showNetworkError(fallbackMessage) {
			return (error) => {
				this.$toasted.error(error.message ? error.toString() : fallbackMessage);
			};
		},
		updateResource(existing, newResource) {
			Object.entries(newResource).forEach(([key, value]) => {
				existing[key] = value;
			});
		},
		// EDIT SINGLE
		patchResource(resource) {
			const resourceViewIndex = this.getResourceSearchIndex(resource);
			return this.$_resourcePatch(resource)
				.then((result) => {
					this.$toasted.show(`L${resourceViewIndex} - Saved`);
					this.updateResource(resource, result);
				})
				.catch(this.showNetworkError(`L${resourceViewIndex} - Failed to save`));
		},
		deleteResource(resource) {
			const resourceViewIndex = this.getResourceSearchIndex(resource);
			return this.$_resourceDelete(resource._id)
				.then((result) => {
					this.$toasted.show(`L${resourceViewIndex} - Deleted`);
					this.resources.splice(this.getResourceIndex(resource), 1);
				})
				.catch(
					this.showNetworkError(`L${resourceViewIndex} - Failed to delete`)
				);
		},
		// EDIT BULK
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
				.catch(this.showNetworkError("Failed to patch"));
		},
		deleteBulk() {
			return this.$_resourceBulkDelete(this.query)
				.then((results) => {
					this.$toasted.show(`Deleted ${results.length} Resources`);
					// give the server some time to sync up elasticsearch
					setTimeout(() => {
						this.$emit("reload");
					}, 3000);
				})
				.catch(this.showNetworkError("Failed to delete"));
		},
	},
};
</script>
