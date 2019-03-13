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
				@click="toggleExpansion(item)"
			>
				<FiletreeEntry
					:id="item.id"
					:icon="
						item.type === 'file'
							? 'insert_drive_file'
							: expandedFolders.includes(item.id)
							? 'folder_open'
							: 'folder'
					"
					:name="item.name"
					:state="item.state"
					:progress="item.progress"
					:read-only="parentState === 'deleted'"
					@delete="deleteEntry"
					@restore="restoreEntry"
				/>
			</li>
			<li v-if="item.type === 'folder'">
				<Filetree
					v-show="expandedFolders.includes(item.id)"
					:filetree.sync="item.objects"
					:value="value"
					:path="path + '/' + item.name"
					:parent-state="item.state"
					@update="$emit('update', $event)"
				/>
			</li>
		</ul>
	</div>
</template>

<script>
import FiletreeEntry from "./FiletreeEntry.vue";
import upload from "./upload.js";
import filetree from "./filetree.js";

export default {
	name: "Filetree",
	components: {
		FiletreeEntry,
	},
	mixins: [upload, filetree],
	props: {
		filetree: {
			type: Array,
			required: true,
		},
		value: {
			type: Object,
			required: true,
		},
		parentState: {
			type: String,
			default: "",
		},
		path: {
			type: String,
			default: "",
		},
	},
	data() {
		return {
			expandedFolders: [],
		};
	},
	watch: {
		parentState: function(to, from) {
			if (to === from) {
				return;
			}
			if (to === "deleted") {
				this.filetree.forEach((item) => {
					this.deleteEntry(item.id, item.name);
				});
			} else if (!to) {
				this.filetree.forEach((item) => {
					this.restoreEntry(item.id, item.name);
				});
			}
		},
	},
	methods: {
		toggleExpansion({ id, type }) {
			if (type !== "folder") {
				return;
			}
			if (this.expandedFolders.includes(id)) {
				this.expandedFolders.splice(this.expandedFolders.indexOf(id), 1);
			} else {
				this.expandedFolders.push(id);
			}
		},
		deleteEntry(id, name) {
			const itemIndex = this.filetree.findIndex((item) => item.name === name);
			const item = this.filetree[itemIndex];
			// already in list
			if (item.state === "deleted" || item.state === "updated") {
				return; // shouldn't be possible
				//return console.warn("deleting this item shouldn't be possible");
			} else if (item.state === "new") {
				this.value.save.splice(this.value.save.indexOf(id), 1);
				this.filetree.splice(itemIndex, 1);
			} else {
				// save files
				this.filetree[itemIndex].state = "deleted";
				if (this.filetree[itemIndex].type === "file") {
					this.value.delete.push(id);
				}
			}
			this.$emit("update", this.value);
			this.$forceUpdate();
		},
		restoreEntry(id, name) {
			const itemIndex = this.filetree.findIndex((item) => item.name === name);
			const item = this.filetree[itemIndex];
			if (item.state === "new") {
				return; // shouldn't be possible
			}
			if (item.state === "updated") {
				this.filetree[itemIndex].state = undefined;

				this.value.save
					.filter((savedId) => {
						let res = savedId.includes(id);
						if (res) return true;
					})
					.forEach((elem) => {
						this.value.save.splice(this.value.save.indexOf(elem), 1);
					});
			}
			if (item.state === "deleted") {
				this.filetree[itemIndex].state = undefined;
				this.value.delete.splice(this.value.delete.indexOf(id), 1);
			}
			this.$emit("update", this.value);
			this.$forceUpdate();
		},
		handleDropEvent(event, prefix, item) {
			if (item.type === "folder") {
				this.dropFile(event, prefix + "/" + item.name).then((newItemsTree) => {
					const srcTree = this.filetree;
					this.recursiveSave(newItemsTree);
					const currentItemIndex = srcTree.findIndex(
						(node) => node.name === item.name
					);
					if (currentItemIndex === -1) {
						srcTree[currentItemIndex].objects.push(
							this.recursiveSetState(newItemsTree, "new")
						);
					} else {
						srcTree[currentItemIndex].objects = this.mergeIntoTree(
							srcTree[currentItemIndex].objects,
							newItemsTree
						);
					}
					this.$emit("update", this.value);
					this.$emit("update:filetree", srcTree);
				});
			}
			this.handleDragleave(event);
		},
		wrappingFolder(event, callback) {
			const wrapper = event.target.closest(".list-item");
			if (Array.from(wrapper.classList).includes("is-folder")) {
				callback(wrapper);
			}
		},
		handleDragover(event) {
			this.wrappingFolder(event, (wrapper) => {
				wrapper.classList.add("dragover");
			});
		},
		handleDragleave(event) {
			this.wrappingFolder(event, (wrapper) => {
				wrapper.classList.remove("dragover");
			});
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
