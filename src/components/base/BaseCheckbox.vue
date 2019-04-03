<template>
	<label>
		<input
			type="checkbox"
			:checked="value"
			:value="label"
			:name="name"
			@change="$emit('input', $event.target.checked)"
		/>
		<span class="checkbox"></span>
		{{ label }}
		<slot name="icon"></slot>
	</label>
</template>

<script>
export default {
	name: "BaseCheckbox",
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
	background: rgba(255, 255, 255, 0);
	border: none;

	.checkbox {
		position: relative;
		display: inline-block;
		width: 1em;
		height: 1em;
		background: white;
		border: 1px solid black;
		border-radius: 2px;
		transition: all 0.2s ease;
	}

	input[type="checkbox"] {
		display: none;

		&:checked + .checkbox {
			color: white;
			background-image: url("~@/assets/icon-check.svg");
			background-size: cover;
		}
	}
}
span {
	font-size: 0.75em;
}
</style>
