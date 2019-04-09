<template>
	<button
		:class="getClass()"
		:type="type"
		:disabled="disabled"
		v-bind="$attrs"
		v-on="$listeners"
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
		raised: {
			type: Boolean,
			default: false,
		},
		roundShape: {
			type: Boolean,
			default: false,
		},
		styling: {
			type: String,
			default: "secondary",
		},
	},
	methods: {
		getClass() {
			return {
				btn: true,
				submit_btn: this.type === "submit",
				secondary_btn: this.type === "button" && this.styling === "secondary",
				primary_btn: this.type === "button" && this.styling === "primary",
				disabled: this.disabled === true,
				raised: this.raised === true,
				round: this.roundShape === true,
			};
		},
	},
};
</script>

<style lang="scss" scoped>
.btn {
	padding: 8px 16px;
	margin: 0 8px;
	font-family: inherit;
	font-size: 14px;
	font-weight: 500;
	text-transform: uppercase;
	background: rgba(255, 255, 255, 0);
	border: none;
	border-radius: 2px;
	transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);

	&:hover {
		cursor: pointer;
	}
}
.submit_btn {
	color: var(--primaryColor);
	background: rgba(255, 255, 255, 0);

	&:hover {
		background: var(--accentColor);
		opacity: 0.95;
	}
}
.primary_btn {
	color: #fff;
	background-color: var(--primaryColor);

	&:hover {
		background: var(--accentColor);
	}
}
.secondary_btn {
	color: black;
	background: rgba(255, 255, 255, 0);

	&:hover {
		background: #00000021;
	}
}
.disabled {
	color: #c4c4c4;
	background: #eee;

	&:hover {
		cursor: default;
		background: #eee;
	}
}
.raised {
	box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
		0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
.round {
	padding: 8px;
	border-radius: 50%;
}
</style>
