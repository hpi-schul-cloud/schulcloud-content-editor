<template>
	<div>
		<BaseCheckbox
			v-model="bulkEdit"
			:label="$lang.resourceManagement.bulk.enableBulkEdit"
		/>
		<br />
		<BaseCheckbox
			v-if="bulkEdit"
			v-model="bulkAdvanced"
			:label="$lang.resourceManagement.bulk.enableBulkEditAdvanced"
		/>

		<BaseTags
			v-model="visibleColoumns"
			:label="$lang.resourceManagement.bulk.visibleColoumns"
			:autocomplete-items="
				availableColoumns.map((a) => ({ text: $lang.resources[a.key] }))
			"
			:add-only-from-autocomplete="true"
		/>

		<ResourceBulkEditTable
			:bulk-inputs="bulkInputs"
			:resources="resources"
			:header-visible="true"
			:visible-coloumns="visibleColoumnAttributes"
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
			visibleColoumns: [],
		};
	},
	computed: {
		bulkInputs() {
			const inputRows = [];
			if (this.bulkEdit) {
				inputRows.push(this.bulkReplace);
				if (this.bulkAdvanced) {
					inputRows.push(this.bulkFind);
				}
			}
			return inputRows;
		},
		attributeNameDictionary() {
			const dict = {};
			Object.entries(this.$lang.resources).forEach(([key, value]) => {
				dict[value] = key;
			});
			return dict;
		},
		visibleColoumnAttributes() {
			return this.visibleColoumns.map(
				(name) => this.attributeNameDictionary[name]
			);
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
	created() {
		[
			"title",
			"isPublished",
			"contentCategory",
			"licenses",
			"description",
		].forEach((attribute) => {
			this.visibleColoumns.push(this.$lang.resources[attribute]);
		});
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
			function removeUndefined(obj) {
				const cleanedData = {};
				Object.entries(obj).forEach(([key, value]) => {
					if (value !== undefined) {
						cleanedData[key] = value;
					}
				});
				return cleanedData;
			}

			function flattenQuery(queryObj, isRoot = true) {
				const flatObj = {};

				for (var key in queryObj) {
					// key not in obj
					if (!queryObj.hasOwnProperty(key)) continue;

					// is nested?
					if (typeof queryObj[key] == "object" && queryObj[key] !== null) {
						var flatObject = flattenQuery(queryObj[key], false);
						for (var nestedKey in flatObject) {
							// key not in obj
							if (!flatObject.hasOwnProperty(nestedKey)) continue;
							if (isRoot) {
								flatObj[key + nestedKey] = flatObject[nestedKey];
							} else {
								flatObj["[" + key + "]" + nestedKey] = flatObject[nestedKey];
							}
						}
					} else {
						if (!isRoot) {
							flatObj["[" + key + "]"] = queryObj[key];
						} else {
							flatObj[key] = queryObj[key];
						}
					}
				}
				return flatObj;
			}

			const replaceQuery = removeUndefined(
				flattenQuery({
					...this.query,
					$replace: this.bulkFind,
				})
			);

			return this.$_resourceBulkPatch(replaceQuery, removeUndefined(data))
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
