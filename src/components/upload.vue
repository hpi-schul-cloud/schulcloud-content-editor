<template>
	<div class="upload-wrapper">
		<div
			id="dropzone"
			:class="{ 'dropzone-over': dragging }"
			@dragover.prevent="handleDragover"
			@dragleave.prevent="handleDragleave"
			@drop.prevent="handleDropEvent"
			>Drop your files here!</div
		>
		<div v-show="filetree.objects.length !== 0" id="filetree">
			<h4>Your uploaded Files:</h4>
			<Filetree
				:value="value"
				:filetree.sync="filetree"
				@update="$emit('update', $event)"
			/>
		</div>
	</div>
</template>

<script>
import Filetree from "@/components/Filetree.vue";
import upload from "@/mixins/upload.js";
import filetree from "@/mixins/filetree.js";

export default {
	name: "Upload",
	components: {
		Filetree,
	},
	mixins: [upload, filetree],
	props: {
		value: {
			type: Object,
			default: () => ({ delete: [], save: [] }),
		},
		filetree: {
			type: Object,
			default: () => ({ id: "", name: "", type: "folder", objects: [] }),
		},
	},
	data() {
		return {
			dragging: false,
		};
	},
	methods: {
		handleDropEvent(event) {
			return this.dropFile(event)
				.then((newItemsForest) => {
					this.recursiveSaveAfterUpload(newItemsForest);
					this.filetree.objects = this.mergeIntoForest(
						this.filetree.objects,
						newItemsForest
					);
					this.$emit("update", this.value); // TODO why? value isn't changed in this method
					return this.$emit("update:filetree", this.filetree);
				})
				.then((res) => {
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
