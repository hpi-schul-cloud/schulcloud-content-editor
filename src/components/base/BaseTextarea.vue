<template>
	<div class="wrapper">
		<label :class="{ invalid: !!error }" :for="name">{{ label }}</label>
		<textarea
			:name="name"
			:maxlength="maxlength"
			:value="value"
			:placeholder="placeholder"
			class="textarea"
			@input="$emit('input', $event.target.value)"
		/>
		<span v-if="!!error" class="invalid">{{ error }}</span>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: String,
			default: "",
		},
		maxlength: {
			type: String,
			default: "100",
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
	margin: 0.5rem 0 1rem;
}
label {
	font-size: 0.9em;
	font-weight: 500;
	color: black;
}
.textarea {
	display: block;
	width: 100%;
	padding: 8px;
	font-family: inherit;
	font-size: 1.15em;
	color: #757575;
	resize: vertical;
	border-radius: 2px;

	&:focus {
		border-color: var(--primaryColor);
		border-width: 2px;
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
