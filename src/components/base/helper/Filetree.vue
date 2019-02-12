<template>
	<div>
		<ul v-for="item in folderEntries" :key="item.id">
			<li
				:class="{
					'list-item': true,
					'is-folder': item.type === 'folder',
				}"
				@dragover.prevent="handleDragover"
				@dragleave.prevent="handleDragleave"
				@drop.prevent="handleDrop($event, path, item)"
			>
				<FiletreeEntry
					:id="item.id"
					:icon="item.type === 'file' ? 'insert_drive_file' : 'folder_open'"
					:name="item.name"
					:is-new="item.isNew"
					:is-deleted="deletedEntries.includes(item.id)"
					:read-only="isParentDeleted"
					@delete="deleteEntry"
					@restore="restoreEntry"
				/>
			</li>
			<li v-if="item.type === 'folder'">
				<Filetree
					v-if="item.type == 'folder'"
					:folder-entries.sync="item.objects"
					:value="value"
					:path="path + '/' + item.name"
					:is-parent-deleted="deletedEntries.includes(item.id)"
				/>
			</li>
		</ul>
	</div>
</template>

<script>
import FiletreeEntry from "./FiletreeEntry.vue";
import upload from "./upload.js";

export default {
	name: "Filetree",
	components: {
		FiletreeEntry,
	},
	mixins: [upload],
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
	data() {
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
					this.deleteEntry(item.id);
				});
			} else {
				this.folderEntries.forEach((item) => {
					this.restoreEntry(item.id);
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
		markAllTreeItemsAsNew(tree) {
			return tree.map((leave) => {
				leave.isNew = true;
				if (leave.type === "folder") {
					leave.objects = this.markAllTreeItemsAsNew(leave.objects);
				}
				return leave;
			});
		},
		handleDrop(event, prefix, item) {
			if (item.type === "folder") {
				this.dropFile(event, prefix + "/" + item.name).then((newItemsTree) => {
					const itemIndex = this.folderEntries.findIndex(
						(folderItem) => folderItem.id === item.id
					);
					if (itemIndex < 0) {
						// ERROR
						return;
					}

					newItemsTree = this.markAllTreeItemsAsNew(newItemsTree);
					// create copy
					const newFolderEntries = this.folderEntries.slice(0);

					newItemsTree.forEach((newItem) => {
						newFolderEntries[itemIndex].objects.push(newItem);
					});
					this.$emit("update:folder-entries", newFolderEntries);
				});
			}
			this.handleDragleave(event);
		},
		handleDragover(event) {
			const wrapper = event.target.closest(".list-item");
			if (Array.from(wrapper.classList).includes("is-folder")) {
				wrapper.classList.add("dragover");
			}
		},
		handleDragleave(event) {
			const wrapper = event.target.closest(".list-item");
			if (Array.from(wrapper.classList).includes("is-folder")) {
				wrapper.classList.remove("dragover");
			}
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
		transition: background-color 0.1s linear 0.1s;
		&.dragover {
			background-color: rgb(154, 243, 191);
			transition: background-color 0.1s linear;
		}
	}
}
</style>
