<template>
	<div :class="classList">
		<span>
			<i class="material-icons">{{ icon }}</i>
		</span>
		<span class="file-name">{{ name }}</span>
		<template v-if="!readOnly">
			<span
				v-if="!state || state === 'new'"
				class="btn-delete"
				@click.stop="$emit('delete', id, name)"
			>
				<i class="material-icons">close</i>
			</span>
			<span
				v-if="['deleted', 'updated'].includes(state)"
				class="restore"
				@click.stop="$emit('restore', id, name)"
			>
				<i class="material-icons">restore_page</i>
			</span>
		</template>
		<progress
			v-if="progress !== undefined"
			class="progress"
			max="100"
			:value="progress"
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
		progress: {
			type: Number || undefined,
			default: undefined,
		},
	},
	computed: {
		classList() {
			const classList = ["entry"];
			if (this.readonly) {
				classList.push("readonly");
			}
			classList.push("is-" + this.state);

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
