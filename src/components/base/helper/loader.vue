<template>
	<div :class="getClass()">
		<div class="loader"></div>
	</div>
</template>

<script>
export default {
	name: "Loader",
	props: {
		state: String,
		validator: (value) => {
			["uploading", "uploaded"].includes(value);
		},
	},
	methods: {
		getClass() {
			return {
				uploading: this.state === "uploading",
				uploaded: this.state === "uploaded",
			};
		},
	},
};
</script>

<style lang="scss" scoped>
.uploaded {
	z-index: -5;
	opacity: 0;
}
.uploading {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 5;
	width: 100%;
	height: 100%;
	background: rgba(34, 34, 34, 0.75);
	opacity: 1;
	transition: opacity 1.5s ease;

	.loader {
		position: absolute;
		top: calc(50% - 30px);
		left: calc(50% - 30px);
		width: 60px;
		height: 60px;
		border: 5px solid #f3f3f3;
		border-top: 5px solid #b10438;
		border-radius: 50%;
		animation: spin 1.5s linear infinite;
	}
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
