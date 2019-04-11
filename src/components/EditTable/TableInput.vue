<template>
	<input
		:aria-label="label"
		v-bind="$attrs"
		:value="value"
		@input="$emit('input', $event.target.value)"
	/>
</template>

<script>
export default {
	props: {
		value: {
			type: String,
			default: "",
		},
		type: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
	},
};
</script>

<style lang="scss" scoped>
input {
	display: block;
	width: 100%;
	height: 100%;
	line-height: inherit;
	background: transparent;
	border: none;
	&:focus {
		outline: none;
	}
}
</style>
