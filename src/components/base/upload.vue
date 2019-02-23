<template>
	<div class="upload-wrapper">
		<Loader :state="loadingState" />
		<div
			id="dropzone"
			:class="{ 'dropzone-over': dragging }"
			@dragover.prevent="handleDragover"
			@dragleave.prevent="handleDragleave"
			@drop.prevent="handleDropEvent"
			>Drag your files here!</div
		>
		<div v-show="filetree.length !== 0" id="filetree">
			<h4>Your uploaded Filetree:</h4>
			<Filetree
				:value="value"
				:path="prefix"
				:filetree.sync="filetree"
				:is-parent-deleted="false"
				@update="$emit('update', $event)"
				@uploaded="loadingState = 'idle'"
				@uploading="loadingState = 'uploading'"
			/>
		</div>
	</div>
</template>

<script>
import Filetree from "./helper/Filetree.vue";
import upload from "./helper/upload.js";
import filetree from "./helper/filetree.js";
import Loader from "@/components/base/helper/UploadLoadingOverlay.vue";

export default {
	name: "Upload",
	components: {
		Filetree,
		Loader,
	},
	mixins: [upload, filetree],
	props: {
		value: {
			type: Object,
			default: () => ({ delete: [], save: [] }),
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
			loadingState: "idle",
		};
	},
	methods: {
		handleDropEvent(event) {
			this.loadingState = "uploading";
			return this.dropFile(event, this.prefix)
				.then((newItemsTree) => {
					this.recursiveSave(newItemsTree);
					const newTree = this.mergeIntoTree(this.filetree, newItemsTree);
					this.$emit("update", this.value);
					return this.$emit("update:filetree", newTree);
				})
				.then((res) => {
					this.loadingState = "idle";
					return res;
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
	position: relative;
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
