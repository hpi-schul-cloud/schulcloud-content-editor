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
					:state="item.state"
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
			const itemIndex = this.filetree.findIndex((item) => item.id === id);
			const item = this.filetree[itemIndex];
			// already in list
			if (item.state === "deleted" || item.state === "updated") {
				return; // shouldn't be possible
				//return console.warn("deleting this item shouldn't be possible");
			} else if (item.state === "new") {
				// TODO remove from filetree
				this.value.saved.splice(this.value.saved.indexOf(id), 1);
				this.filetree.splice(itemIndex, 1);
			} else {
				// saved files
				this.filetree[itemIndex].state = "deleted";
				this.value.deleted.push(id);
			}
			this.$forceUpdate();
		},
		restoreEntry(id) {
			const itemIndex = this.filetree.findIndex((item) => item.id === id);
			const item = this.filetree[itemIndex];
			if (item.state === "new") {
				return; // shouldn't be possible
			}
			if (item.state === "updated") {
				this.filetree[itemIndex].state = undefined;
				this.value.saved.splice(this.value.saved.indexOf(id), 1);
			}
			if (item.state === "deleted") {
				this.filetree[itemIndex].state = undefined;
				this.value.deleted.splice(this.value.deleted.indexOf(id), 1);
			}
			this.$forceUpdate();
		},
		markAllTreeItemsAsNew(tree) {
			return tree.map((leave) => {
				leave.state = "new";
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
