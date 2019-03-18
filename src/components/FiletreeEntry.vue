<template>
	<div :class="classList">
		<button type="button" class="btn-icon">
			<i class="material-icons">{{ icon }}</i>
		</button>
		<span class="file-name">{{ file.name }}</span>
		<template v-if="!readOnly">
			<button
				v-if="!file.state || file.state === 'new'"
				type="button"
				class="btn-icon btn-delete"
				@click.stop="$emit('delete', file.id, file.name)"
			>
				<i class="material-icons">close</i>
			</button>
			<button
				v-if="['deleted', 'updated'].includes(file.state)"
				type="button"
				class="btn-icon btn-restore"
				@click.stop="$emit('restore', file.id, file.name)"
			>
				<i class="material-icons">restore_page</i>
			</button>
		</template>
		<progress
			v-if="file.progress !== undefined"
			class="progress"
			max="100"
			:value="file.progress"
		/>
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
		file: {
			type: Object,
			required: true,
		},
		readOnly: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		classList() {
			const classList = ["entry"];
			if (this.readonly) {
				classList.push("readonly");
			}
			classList.push("is-" + this.file.state);

			return classList;
		},
	},
};
</script>

<style lang="scss" scoped>
.entry {
	position: relative;
	display: flex;
	flex-wrap: nowrap;
	span,
	.btn-icon {
		display: flex;
		align-items: center;
		margin: 0.2em 0.2em 0.2em 0;
	}
	.btn-icon {
		padding: 0;
		color: inherit;
		user-select: none;
		background: transparent;
		border: none;
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
.progress {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 4px;
	-webkit-appearance: none;
	appearance: none;
	&::-webkit-progress-bar {
		background-color: #aaa;
		border-radius: 100px;
	}
	&::-webkit-progress-value {
		background-color: #0a0;
		border-radius: 100px;
	}
}
</style>
