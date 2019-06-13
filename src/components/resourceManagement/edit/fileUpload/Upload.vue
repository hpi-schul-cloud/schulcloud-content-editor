<template>
	<div class="upload-wrapper">
		<Dropzone @drop.prevent="handleDropEvent">
			{{ this.$lang.buttons.dropzone }}
		</Dropzone>
		<div id="filetree" v-show="filetree.objects.length !== 0">
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
import Filetree from "@/components/resourceManagement/edit/fileUpload/Filetree";
import Dropzone from "@/components/resourceManagement/Dropzone";
import upload from "@/mixins/upload.js";
import filetree from "@/mixins/filetree.js";

export default {
	components: {
		Filetree,
		Dropzone,
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
	methods: {
		handleDropEvent(event) {
			return this.$_dropFile(event)
				.then((newItemsForest) => {
					this.$_recursiveSaveAfterUpload(newItemsForest);
					this.filetree.objects = this.$_mergeIntoForest(
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
	},
};
</script>

<style lang="scss" scoped>
.upload-wrapper {
	position: relative;
	padding: 16px;

	#filetree {
		margin: 1em auto;
	}
}
</style>
