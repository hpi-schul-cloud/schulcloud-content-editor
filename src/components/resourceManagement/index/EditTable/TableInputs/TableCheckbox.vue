<template>
	<label>
		<input
			:aria-label="label"
			type="checkbox"
			v-bind="$attrs"
			:checked="value"
			:value="label"
			:name="name"
			@change="$emit('input', $event.target.checked)"
		/>
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
	display: block;
	width: 100%;
	text-align: center;
	cursor: pointer;
	input {
		cursor: pointer;
		outline: none;
	}
}
</style>
