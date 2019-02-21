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
		<div v-if="filetree.length !== 0" id="filetree">
			<h4>Your uploaded Filetree:</h4>
			<Filetree
				v-model="value"
				:path="prefix"
				:filetree.sync="filetree"
				:is-parent-deleted="false"
				@uploaded="adjustLoaderState('uploaded')"
				@uploading="adjustLoaderState('uploading')"
			/>
		</div>
	</div>
</template>

<script>
import Filetree from "./helper/Filetree.vue";
import upload from "./helper/upload.js";
import filetree from "./helper/filetree.js";
import Loader from "@/components/base/helper/loader.vue";

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
			loadingState: "uploaded",
		};
	},
	methods: {
		adjustLoaderState(state) {
			this.loadingState = state;
		},
		handleDropEvent(event) {
			this.adjustLoaderState("uploading");
			return this.dropFile(event, this.prefix)
				.then((newItemsTree) => {
					this.recursiveSave(newItemsTree);
					const newTree = this.mergeIntoTree(this.filetree, newItemsTree);
					return this.$emit("update:filetree", newTree);
				})
				.then((res) => {
					this.adjustLoaderState("uploaded");
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
