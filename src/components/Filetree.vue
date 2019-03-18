<template>
	<div>
		<ul v-for="item in filetree.objects" :key="item.id">
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
					:icon="
						item.type === 'file'
							? 'insert_drive_file'
							: expandedFolders.includes(item.id)
							? 'folder_open'
							: 'folder'
					"
					:file="item"
					:read-only="parentState === 'deleted'"
					@delete="deleteEntry"
					@restore="restoreEntry"
				/>
			</li>
			<li v-if="item.type === 'folder'">
				<Filetree
					v-show="expandedFolders.includes(item.id)"
					:filetree.sync="item"
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
import FiletreeEntry from "@/components/FiletreeEntry.vue";
import upload from "@/mixins/upload.js";
import filetree from "@/mixins/filetree.js";

export default {
	name: "Filetree",
	components: {
		FiletreeEntry,
	},
	mixins: [upload, filetree],
	props: {
		filetree: {
			type: Object,
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
				this.filetree.objects.forEach((item) => {
					this.deleteEntry(item.id, item.name);
				});
			} else if (!to) {
				this.filetree.objects.forEach((item) => {
					this.restoreEntry(item.id, item.name);
				});
			}
		},
		filetree: {
			handler: function(to, from) {
				if (to.type === "folder") {
					const folderProgress = to.objects.reduce((progress, item) => {
						return item.progress
							? progress
								? (progress + item.progress) / 2
								: item.progress
							: progress;
					}, 0);
					this.filetree.progress = folderProgress ? folderProgress : undefined;
					this.$forceUpdate();
				}
			},
			deep: true,
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
		getItemIndex(name) {
			return this.filetree.objects.findIndex((item) => item.name === name);
		},
		abortRequest(file) {
			if (file.xhr) {
				file.xhr.abort();
				file.xhr = undefined;
			}
			return file;
		},
		deleteEntry(id, name) {
			const itemIndex = this.getItemIndex(name);
			this.abortRequest(this.filetree.objects[itemIndex]);
			const item = this.filetree.objects[itemIndex];
			// already in list
			if (item.state === "deleted" || item.state === "updated") {
				return console.warn(
					new Error("deleting this item shouldn't be possible")
				);
			} else if (item.state === "new") {
				// don't save anymore
				this.value.save.splice(this.value.save.indexOf(id), 1);
				this.filetree.objects.splice(itemIndex, 1);
			} else {
				// save files
				this.filetree.objects[itemIndex].state = "deleted";
				if (this.filetree.objects[itemIndex].type === "file") {
					this.value.delete.push(id);
				}
			}
			this.$emit("update", this.value);
			this.$forceUpdate();
		},
		restoreEntry(id, name) {
			const itemIndex = this.getItemIndex(name);
			this.abortRequest(this.filetree.objects[itemIndex]);
			const item = this.filetree.objects[itemIndex];
			if (item.state === "new") {
				console.error(new Error("unhandled state"));
				return; // shouldn't be possible
			}
			if (item.state === "updated") {
				this.filetree.objects[itemIndex].id = item.originalId;
				this.filetree.objects[itemIndex].originalId = undefined;
				this.filetree.objects[itemIndex].state = undefined;

				this.value.save
					.filter((savedId) => savedId.includes(id))
					.forEach((elem) => {
						this.value.save.splice(this.value.save.indexOf(elem), 1);
					});
			}
			if (item.state === "deleted") {
				this.filetree.objects[itemIndex].state = undefined;
				this.value.delete.splice(this.value.delete.indexOf(id), 1);
			}
			this.$emit("update", this.value);
			this.$forceUpdate();
		},
		handleDropEvent(event, prefix, item) {
			if (item.type === "folder") {
				this.$_dropFile(event, prefix + "/" + item.name).then(
					(newItemsForest) => {
						const srcTree = this.filetree.objects;
						this.$_recursiveSaveAfterUpload(newItemsForest);
						const currentItemIndex = srcTree.findIndex(
							(node) => node.name === item.name
						);
						if (currentItemIndex === -1) {
							this.filetree.objects[currentItemIndex].objects.push(
								this.$_recursiveSetState(newItemsForest, "new")
							);
						} else {
							this.filetree.objects[
								currentItemIndex
							].objects = this.$_mergeIntoForest(
								this.filetree.objects[currentItemIndex].objects,
								newItemsForest
							);
						}
						this.$emit("update", this.value);
						this.$emit("update:filetree", this.filetree);
					}
				);
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
