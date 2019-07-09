<template>
	<textarea
		:aria-label="label"
		v-bind="$attrs"
		:value="value"
		@input="$emit('input', $event.target.value)"
		rows="1"
	/>
</template>

<script>
export default {
	props: {
		value: {
			type: String,
			default: "",
		},
		label: {
			type: String,
			required: true,
		},
	},
};
</script>

<style lang="scss" scoped>
textarea {
	display: block;
	width: 100%;
	min-width: 250px;
	height: 100%;
	padding: 0;
	margin: 0;
	line-height: inherit;
	resize: none;
	background: transparent;
	border: none;
	&::-webkit-scrollbar {
		width: 0;
		height: 0;
		background: transparent;
	}
	&:focus {
		height: 150px;
		outline: none;
	}
}
</style>
