<template>
	<div>
		<ul v-for="item in folderEntries" :key="item.id">
			<li v-if="item.type === 'file'">
				<FiletreeEntry
					:id="item.id"
					icon="insert_drive_file"
					:name="item.name"
					:is-deleted="deletedObjects.includes(item.id)"
					:read-only="isParentDeleted"
					@delete="deleteFile"
					@restore="restoreFile"
				/>
			</li>

			<template v-if="item.type === 'folder'">
				<li>
					<FiletreeEntry
						:id="item.id"
						icon="folder_open"
						:name="item.name"
						:is-deleted="deletedObjects.includes(item.id)"
						:read-only="isParentDeleted"
						@delete="deleteFolder"
						@restore="restoreFolder"
					/>
				</li>
				<li>
					<Filetree
						v-if="item.type == 'folder'"
						:folder-entries="item.objects"
						:value="value"
						:is-parent-deleted="deletedObjects.includes(item.id)"
						@restoreFromDeletedFolder="handleRestoreFromDeletedFolder(item.id)"
					/>
				</li>
			</template>
		</ul>
	</div>
</template>

<script>
import FiletreeEntry from "./FiletreeEntry.vue";
export default {
	name: "Filetree",
	components: {
		FiletreeEntry,
	},
	props: {
		folderEntries: {
			type: Array,
			required: true,
		},
		value: {
			type: Object,
			required: true,
		},
		isParentDeleted: {
			type: Boolean,
			default: false,
		},
	},
	data: () => {
		return {
			deletedObjects: [],
		};
	},
	watch: {
		isParentDeleted: function(to, from) {
			if (to === from) {
				return;
			}
			if (to === true) {
				this.folderEntries.forEach((item) => {
					if (item.type === "file") {
						this.deleteFile(item.id);
					}
					if (item.type === "folder") {
						this.deleteFolder(item.id);
					}
				});
			} else {
				this.folderEntries.forEach((item) => {
					if (item.type === "file") {
						this.restoreFile(item.id);
					}
					if (item.type === "folder") {
						this.restoreFolder(item.id);
					}
				});
			}
		},
	},
	methods: {
		deleteFile(id) {
			if (this.deletedObjects.indexOf(id) === -1) {
				this.deletedObjects.push(id);
			}
		},
		restoreFile(id) {
			this.deletedObjects.splice(this.deletedObjects.indexOf(id), 1);
		},

		deleteFolder(id) {
			if (this.deletedObjects.indexOf(id) === -1) {
				this.deletedObjects.push(id);
			}
		},
		restoreFolder(id) {
			this.deletedObjects.splice(this.deletedObjects.indexOf(id), 1);
		},
	},
};
</script>

<style lang="scss" scoped>
ul {
	padding-left: 1.5rem;
	margin: 0;
	li {
		list-style-type: none;
	}
}
</style>
