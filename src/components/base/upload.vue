<template>
	<div class="upload-wrapper">
		<div
			id="dropzone"
			:class="{ 'dropzone-over': dragging }"
			@dragover.prevent="handleDragover"
			@dragleave.prevent="handleDragleave"
			@drop.prevent="handleDropEvent"
			>Drag your files here!</div
		>
		<div id="filetree">
			<h4>Your uploaded Filetree:</h4>
			<Filetree
				v-model="value"
				:path="prefix"
				:filetree="filetree"
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
		value: {
			type: Object,
			default: () => ({ deleted: [], saved: [] }),
		},
		filetree: {
			type: Array,
			default: () => [],
		},
		prefix: {
			type: String,
			default: "",
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
				if (leave.type === "file") {
					this.value.saved.push(leave.id);
				}
				return leave;
			});
		},
		handleDropEvent(event) {
			return this.dropFile(event, this.prefix).then((newItemsTree) => {
				const newFiletree = JSON.parse(JSON.stringify(this.filetree.slice(0))); // create copy
				newItemsTree = this.markAllTreeItemsAsNew(newItemsTree);
				newItemsTree.forEach((newItem) => {
					const existingItemIndex = newFiletree.findIndex(
						(item) => item.id === newItem.id
					);
					if (existingItemIndex === -1) {
						newItem.state = "new";
						newFiletree.push(newItem);
					} else {
						newFiletree[existingItemIndex].state = "updated";
					}
				});
				this.$emit("update:filetree", newFiletree);
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
