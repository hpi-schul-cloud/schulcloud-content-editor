<template>
	<div>
		<BaseTags
			v-model="visibleColoumns"
			label="Select Coloumns"
			:autocomplete-items="availableColoumns.map((a) => ({ text: a.key }))"
			:add-only-from-autocomplete="true"
		/>

		<ResourceEditTable
			v-if="resources.length"
			:resources="resources"
			:header-visible="true"
			:visible-coloumns="visibleColoumns"
			:index-start="resourceStartIndex"
			@patchResource="patchResource"
		/>
	</div>
</template>

<script>
import BaseTags from "@/components/base/BaseTags.vue";
import ResourceEditTable, {
	availableColoumns,
} from "@/components/ResourceEditTable.vue";

import api from "@/mixins/api.js";

export default {
	components: {
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
	methods: {
		patchResource(resource) {
			const resourceViewIndex =
				this.resourceStartIndex + this.resources.indexOf(resource);
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
