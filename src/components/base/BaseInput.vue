<template>
	<div class="wrapper">
		<label v-if="label" :class="{ invalid: !!error }" :for="name">
			{{ label }}
		</label>
		<input
			v-bind="$attrs"
			class="input"
			:name="name"
			:type="type"
			:value="value"
			:placeholder="placeholder"
			@input="$emit('input', $event.target.value)"
		/>
		<slot name="icon"></slot>
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
	position: relative;
	width: 100%;
	margin: 1.5em 0;
}
label {
	font-size: 0.9em;
	font-weight: 500;
	color: black;
}
.input {
	display: block;
	width: 100%;
	font-size: 1.15em;
	line-height: 32px;
	color: #757575;
	background: rgba(255, 255, 255, 0);
	border: none;
	border-bottom: 1px solid #949494;

	&:focus {
		border-bottom-color: var(--primaryColor);
		border-bottom-width: 2px;
		outline: none;
	}
}
span {
	font-size: 0.75em;
}
.invalid {
	color: var(--primaryColor);
}
</style>
