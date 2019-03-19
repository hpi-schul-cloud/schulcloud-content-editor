<template>
	<div class="wrapper">
		<label :class="{ invalid: !!error }" :for="name">{{ label }}</label>
		<input
			v-bind="$attrs"
			class="input"
			:name="name"
			:type="type"
			:value="value"
			:placeholder="placeholder"
			@input="$emit('input', $event.target.value)"
		/>
		<span v-if="!!error" class="invalid">{{ error }}</span>
	</div>
</template>

<script>
export default {
	name: "BaseInput",
	props: {
		value: {
			type: String,
			default: "",
		},
		type: {
			type: String,
			default: "text",
		},
		label: {
			type: String,
			required: true,
		},
		placeholder: {
			type: String,
			default: "",
		},
		error: {
			type: String,
			default: "",
		},
		name: {
			type: String,
			default: "",
		},
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	margin: 1.5em 0;
}
label {
	padding-left: 8px;
	font-size: 0.9em;
	font-weight: 500;
	color: black;
}
.input {
	display: block;
	width: 100%;
	padding: 0 8px 8px;
	font-size: 1.15em;
	color: #757575;
	border: none;
	border-bottom: 1px solid #949494;

	&:focus {
		border-bottom-color: #b10438;
		border-bottom-width: 2px;
		outline: none;
	}
}
span {
	font-size: 0.75em;
}
.invalid {
	color: #b10438;
}
</style>
