<template>
	<div :class="{ entry: true, deleted: isDeleted, 'read-only': readOnly }">
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
export default {
	name: "FiletreeEntry",
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
</style>
