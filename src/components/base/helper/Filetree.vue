<template>
	<div>
		<ul v-for="item in filetree" :key="item.id">
			<li
				:class="{
					'list-item': true,
					'is-folder': item.type === 'folder',
				}"
				@dragover.prevent="handleDragover"
				@dragleave.prevent="handleDragleave"
				@drop.prevent="handleDropEvent($event, path, item)"
			>
				<FiletreeEntry
					:id="item.id"
					:icon="item.type === 'file' ? 'insert_drive_file' : 'folder_open'"
					:name="item.name"
					:is-new="item.isNew"
					:is-deleted="value.deleted.includes(item.id)"
					:read-only="isParentDeleted"
					@delete="deleteEntry"
					@restore="restoreEntry"
				/>
			</li>
			<li v-if="item.type === 'folder'">
				<Filetree
					v-if="item.type == 'folder'"
					:filetree.sync="item.objects"
					:value="value"
					:path="path + '/' + item.name"
					:is-parent-deleted="value.deleted.includes(item.id)"
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
		filetree: {
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
	watch: {
		isParentDeleted: function(to, from) {
			if (to === from) {
				return;
			}
			if (to === true) {
				this.filetree.forEach((item) => {
					this.deleteEntry(item.id);
				});
			} else {
				this.filetree.forEach((item) => {
					this.restoreEntry(item.id);
				});
			}
		},
	},
	methods: {
		deleteEntry(id) {
			const itemIndex = this.value.deleted.indexOf(id);
			if (itemIndex !== -1) {
				return; // already in list
			}
			if (this.filetree.isNew) {
				this.value.saved.splice(this.value.saved.indexOf(id), 1);
			} else {
				this.value.deleted.push(id);
			}
		},
		restoreEntry(id) {
			this.value.deleted.splice(this.value.deleted.indexOf(id), 1);
		},
		markAllTreeItemsAsNew(tree) {
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
		handleDropEvent(event, prefix, item) {
			if (item.type === "folder") {
				this.dropFile(event, prefix + "/" + item.name).then((newItemsTree) => {
					const itemIndex = this.filetree.findIndex(
						(folderItem) => folderItem.id === item.id
					);
					if (itemIndex < 0) {
						return;
					}

					newItemsTree = this.markAllTreeItemsAsNew(newItemsTree);
					// create copy
					const newfiletree = this.filetree.slice(0);

					newItemsTree.forEach((newItem) => {
						newfiletree[itemIndex].objects.push(newItem);
					});
					this.$emit("update:filetree", newfiletree);
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
