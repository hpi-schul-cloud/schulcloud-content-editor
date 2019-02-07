<template>
	<div>
		<ul v-for="item in folderEntries" :key="item.id">
			<li v-if="item.type === 'file'">
				<FiletreeEntry
					:id="item.id"
					icon="insert_drive_file"
					:name="item.name"
					:is-deleted="deletedEntries.includes(item.id)"
					:read-only="isParentDeleted"
					@delete="deleteEntry"
					@restore="restoreEntry"
				/>
			</li>

			<template v-if="item.type === 'folder'">
				<li>
					<FiletreeEntry
						:id="item.id"
						icon="folder_open"
						:name="item.name"
						:is-deleted="deletedEntries.includes(item.id)"
						:read-only="isParentDeleted"
						:allow-upload="true"
						:path="path + '/' + item.id"
						@delete="deleteEntry"
						@restore="restoreEntry"
					/>
				</li>
				<li>
					<Filetree
						v-if="item.type == 'folder'"
						:folder-entries="item.objects"
						:value="value"
						:path="path + '/' + item.id"
						:is-parent-deleted="deletedEntries.includes(item.id)"
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
		path: {
			type: String,
			default: "",
		},
	},
	data: () => {
		return {
			deletedEntries: [],
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
						this.deleteEntry(item.id);
					}
					if (item.type === "folder") {
						this.deleteEntry(item.id);
					}
				});
			} else {
				this.folderEntries.forEach((item) => {
					if (item.type === "file") {
						this.restoreEntry(item.id);
					}
					if (item.type === "folder") {
						this.restoreEntry(item.id);
					}
				});
			}
		},
	},
	methods: {
		deleteEntry(id) {
			if (this.deletedEntries.indexOf(id) === -1) {
				this.deletedEntries.push(id);
			}
		},
		restoreEntry(id) {
			this.deletedEntries.splice(this.deletedEntries.indexOf(id), 1);
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
