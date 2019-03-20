<template>
	<button :class="getClass()" :disabled="disabled">
		<slot></slot>
	</button>
</template>

<script>
export default {
	name: "BaseButton",
	props: {
		type: {
			type: String,
			default: "button",
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		form: {
			type: String,
			default: "",
		},
	},
	methods: {
		getClass() {
			return {
				btn: true,
				disabled: this.disabled === true,
				submit_btn: this.type === "submit",
				normal_btn: this.type === "button",
			};
		},
		submit() {
			this.$emit("btnClicked");
		},
	},
};
</script>

<style lang="scss" scoped>
.btn {
	padding: 8px;
	font-family: inherit;
	font-size: 14px;
	font-weight: 500;
	text-transform: uppercase;
	background: #fff;
	border: none;
	border-radius: 2px;

	&:hover {
		cursor: pointer;
	}
}
.submit_btn {
	color: #b10438;

	&:hover {
		background: #b104381f;
	}
}
.normal_btn {
	color: black;

	&:hover {
		background: #00000021;
	}
}
.disabled {
	color: #c4c4c4;

	&:hover {
		background: #fff;
	}
}
</style>
