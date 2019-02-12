<template>
	<div
		:class="{
			entry: true,
			deleted: isDeleted,
			'read-only': readOnly,
			dragover: isDragover,
		}"
		@dragover="handleDragover"
		@dragleave="handleDragleave"
		@drop="handleDrop"
	>
		<span>
			<i class="material-icons">{{ icon }}</i>
		</span>
		<span class="file-name">{{ name }}</span>
		<template v-if="!readOnly">
			<span v-if="!isDeleted" class="delete" @click="$emit('delete', id)">
				<i class="material-icons">close</i>
			</span>
			<span v-else class="restore" @click="$emit('restore', id)">
				<i class="material-icons">restore_page</i>
			</span>
		</template>
	</div>
</template>

<script>
import upload from "./upload.js";

export default {
	name: "FiletreeEntry",
	mixins: [upload],
	props: {
		icon: {
			type: String,
			default: "insert_drive_file", // folder_open
		},
		name: {
			type: String,
			required: true,
		},
		id: {
			type: String,
			required: true,
		},
		readOnly: {
			type: Boolean,
			default: false,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		allowUpload: {
			type: Boolean,
			default: false,
		},
		path: {
			type: String,
			default: "/",
		},
	},
	data() {
		return {
			isDragover: false,
		};
	},
	created() {
		this.setPathPrefix(this.path);
	},
	methods: {
		handleDrop(event) {
			if (this.allowUpload) {
				this.dropFile(event).then((res) => {
					console.log("Upload result:", res); // eslint-disable-line no-console
				});
			}
			this.isDragover = false;
		},
		handleDragover(event) {
			event.preventDefault();
			this.isDragover = true;
		},
		handleDragleave(event) {
			event.preventDefault();
			this.isDragover = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.entry {
	display: flex;
	flex-wrap: nowrap;

	span {
		display: flex;
		align-items: center;
		margin: 0.2em 0.2em 0.2em 0;
	}
	.delete {
		display: none;
	}
	&:not(.read-only):hover {
		cursor: pointer;
		background: #eee;
		.delete {
			display: flex;
		}
	}
}
.file-name {
	flex: 1;
}

.material-icons {
	font-size: 20px;
}

.deleted {
	color: red;
	.file-name {
		text-decoration: line-through;
	}
}
.dragover {
	background: #faa;
}
</style>
