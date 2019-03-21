<template>
	<button
		:class="getClass()"
		:type="type"
		:disabled="disabled"
		@click="$emit('ButtonClicked')"
	>
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
		delete: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		getClass() {
			return {
				btn: true,
				disabled: this.disabled === true,
				submit_btn: this.type === "submit",
				normal_btn: this.type === "button",
				delete_btn: this.delete === true,
			};
		},
	},
};
</script>

<style lang="scss" scoped>
.btn {
	padding: 8px;
	margin: 0 8px;
	font-family: inherit;
	font-size: 14px;
	font-weight: 500;
	text-transform: uppercase;
	background: #fff;
	border: none;
	border-radius: 2px;
	transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);

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
