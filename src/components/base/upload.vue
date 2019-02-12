<template>
	<div class="upload-wrapper">
		<div
			id="dropzone"
			:class="{ 'dropzone-over': dragging }"
			@dragover.prevent="handleDragover"
			@dragleave.prevent="handleDragleave"
			@drop.prevent="handleDrop"
			>Drag your files here!</div
		>
		<div id="filetree">
			<h4>Your uploaded Filetree:</h4>
			<Filetree
				v-model="state"
				:folder-entries="filetree"
				:is-parent-deleted="false"
			/>
		</div>
	</div>
</template>

<script>
import Filetree from "./helper/Filetree.vue";
import upload from "./helper/upload.js";

export default {
	name: "Upload",
	components: {
		Filetree,
	},
	mixins: [upload],
	props: {
		state: {
			type: Object,
			default: () => ({ deleted: [], saved: [] }),
		},
		filetree: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			dragging: false,
		};
	},
	methods: {
		markAllTreeItemsAsNew(tree) {
			// TODO duplicate of Filetree.vue
			return tree.map((leave) => {
				leave.isNew = true;
				if (leave.type === "folder") {
					leave.objects = this.markAllTreeItemsAsNew(leave.objects);
				}
				return leave;
			});
		},
		handleDrop(event, prefix, item) {
			// TODO add contentId prefix
			return this.dropFile(event, "/").then((newItems) => {
				newItems = this.markAllTreeItemsAsNew(newItems);
				newItems.forEach((newItem) => {
					this.filetree.push(newItem);
				});
			});
		},
		handleDragover(event) {
			this.dragging = true;
		},
		handleDragleave(event) {
			this.dragging = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.upload-wrapper {
	padding: 16px;
	#dropzone {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100px;
		padding: 16px;
		margin: 1em auto;
		border: 2px dashed black;
		border-radius: 8px;
	}

	.dropzone-over {
		background: #eee;
	}

	#filetree {
		margin: 1em auto;
	}
}
</style>
