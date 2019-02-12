<template>
	<div
		:class="{
			entry: true,
			readonly: readOnly,
			'is-new': state === 'new',
			'is-updated': state === 'updated',
			'is-deleted': state === 'deleted',
		}"
	>
		<span>
			<i class="material-icons">{{ icon }}</i>
		</span>
		<span class="file-name">{{ name }}</span>
		<template v-if="!readOnly">
			<span
				v-if="!state || state === 'new'"
				class="btn-delete"
				@click="$emit('delete', id)"
			>
				<i class="material-icons">close</i>
			</span>
			<span
				v-if="['deleted', 'updated'].includes(state)"
				class="restore"
				@click="$emit('restore', id)"
			>
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
		state: {
			type: String || Boolean,
			default: "",
		},
	},
};
</script>

<style lang="scss" scoped>
.entry {
	display: flex;
	flex-wrap: nowrap;
	color: #333;
	span {
		display: flex;
		align-items: center;
		margin: 0.2em 0.2em 0.2em 0;
	}
	.btn-delete {
		display: none;
	}
	&:not(.readonly):hover {
		cursor: pointer;
		background: #eee;
		.btn-delete {
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

.is-deleted {
	color: #f00;
	.file-name {
		text-decoration: line-through;
	}
}
.is-updated {
	color: #d90;
}
.is-new {
	color: #0a0;
}
</style>
