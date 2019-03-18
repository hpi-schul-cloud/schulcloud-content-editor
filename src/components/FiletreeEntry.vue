<template>
	<div :class="classList">
		<i class="icon material-icons">{{ icon }}</i>
		<span class="file-name">{{ file.name }}</span>
		<template v-if="!readOnly">
			<button
				v-if="!file.state || file.state === 'new' || file.state === 'modified'"
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
			classList.push("is-" + this.file.type);
			classList.push("is-" + this.file.state);

			return classList;
		},
	},
	watch: {
		file: {
			handler: function(to, from) {
				this.$forceUpdate();
			},
			deep: true,
		},
	},
};
</script>

<style lang="scss" scoped>
.entry {
	position: relative;
	display: flex;
	flex-wrap: nowrap;
	.icon,
	.file-name,
	.btn-icon {
		display: flex;
		align-items: center;
		margin: 0.2em 0.2em 0.2em 0;
	}
	.file-name {
		flex: 1;
	}
	.icon,
	.btn-icon {
		padding: 0;
		color: inherit;
		user-select: none;
		background: transparent;
		border: none;
	}
	.btn-icon {
		cursor: pointer;
	}
	.btn-delete {
		display: none;
	}
	&:not(.readonly):hover {
		background: #eee;
		.btn-delete {
			display: flex;
		}
	}
}

.material-icons {
	font-size: 20px;
}

.is-file {
	cursor: auto;
}
.is-folder {
	cursor: pointer;
	user-select: none;
}

.is-deleted {
	color: #f00;
	.file-name {
		text-decoration: line-through;
	}
}
.is-updated,
.is-modified {
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
