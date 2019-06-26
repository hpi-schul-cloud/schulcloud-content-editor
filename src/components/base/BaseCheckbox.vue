<template>
	<label>
		<input
			:checked="value"
			:value="label"
			:name="name"
			@change="$emit('input', $event.target.checked)"
			type="checkbox"
		/>
		<span class="checkbox"></span>
		{{ label }}
		<slot name="icon"></slot>
	</label>
</template>

<script>
export default {
	props: {
		value: {
			type: Boolean,
			default: false,
		},
		label: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			default: "",
		},
	},
};
</script>

<style lang="scss" scoped>
label {
	position: relative;
	font-size: 1.15em;
	line-height: 32px;
	color: #757575;
	user-select: none;
	background: rgba(255, 255, 255, 0);
	border: none;

	.checkbox {
		position: relative;
		display: inline-block;
		width: 1em;
		height: 1em;
		background: white;
		background-size: cover;
		border: 1px solid black;
		border-radius: 2px;
	}

	input[type="checkbox"] {
		/* https://snook.ca/archives/html_and_css/hiding-content-for-accessibility */
		position: absolute;
		top: 0;
		left: 0;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
		clip: rect(1px, 1px, 1px, 1px);

		&:checked + .checkbox {
			background-image: url("~@/assets/icon-check.svg");
		}

		&:focus + .checkbox {
			outline: 2px solid var(--primaryColor);
			outline-offset: 2px;
		}
	}
}
span {
	font-size: 0.75em;
}
</style>
