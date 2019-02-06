<template>
	<div class="upload-wrapper">
		<div
			id="dropzone"
			:class="{ 'dropzone-over': dragging }"
			@dragenter="dragging = true"
			@dragleave="dragging = false"
			>Drag your files here!</div
		>
		<div id="filetree" ref="filetree">
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
import Filetree from "./helper/FiletreeEntry.vue";

export default {
	name: "Upload",
	components: {
		Filetree,
	},
	props: {
		state: {
			type: Object,
			default: () => ({ deleted: [], saved: [] }),
		},
		filetree: {
			type: Array,
			default: () => [
				{
					id: "file1_id",
					type: "file",
					name: "file 1",
				},
				{
					type: "folder",
					id: "folder_1",
					name: "folder 1",
					objects: [
						{
							id: "file2_id",
							type: "file",
							name: "file 2",
						},
						{
							id: "folder_2",
							type: "folder",
							name: "folder 2",
							objects: [
								{
									id: "file3_id",
									type: "file",
									name: "file 3",
								},
							],
						},
						{
							id: "file4_id",
							type: "file",
							name: "file 4",
						},
					],
				},
			],
		},
	},
	data() {
		return {
			dragging: false,
		};
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
