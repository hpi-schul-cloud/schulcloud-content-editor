<template>
	<div
		id="dropzone"
		:class="{ 'dropzone-over': dragging }"
		@dragstart.prevent="handleDragover"
		@dragover.prevent="handleDragover"
		@dragleave.prevent="handleDragleave"
		@drop.prevent="handleDropEvent"
		v-on="$listeners"
	>
		<slot>
			<label class="input-label">
				<i class="material-icons upload-icon">cloud_upload</i>
				<slot name="description">Lade hier eine Datei hoch</slot>
				<slot name="input">
					<input
						@input="handleInput"
						v-bind="inputAttributes"
						class="hidden-but-accessible"
						type="file"
					/>
				</slot>
			</label>
		</slot>
	</div>
</template>
<script>
export default {
	props: {
		inputAttributes: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			dragging: false,
		};
	},
	methods: {
		handleDragover(event) {
			event.dataTransfer.dropEffect = "copy";
			this.dragging = true;
		},
		handleDragleave(event) {
			this.dragging = false;
		},
		handleDropEvent(event) {
			this.dragging = false;
			this.emitFileEvent(event.dataTransfer.files);
		},
		handleInput(event) {
			this.emitFileEvent(event.target.files);
		},
		emitFileEvent(files) {
			this.$emit("files", files);
		},
	},
};
</script>
<style lang="scss" scoped>
#dropzone {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100px;
	margin: 1em auto;
	border: 2px dashed black;
	border-radius: 8px;
	transition: background-color 0.3s ease-in-out;
}

.dropzone-over {
	background: #ccc;
}

.hidden-but-accessible {
	position: absolute;
	width: 0;
	height: 0;
}
.input-label {
	flex: 1;
	padding: 2em;
	text-align: center;
	cursor: pointer;
}
.upload-icon {
	display: block;
	font-size: 5em;
	color: #aaa;
}
</style>
