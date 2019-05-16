<template>
	<input
		:aria-label="label"
		v-bind="$attrs"
		:value="formattedDate"
		type="datetime-local"
	/>
</template>

<script>
// 2017-08-14T10:02:50.053000
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
	computed: {
		formattedDate: {
			get() {
				return this.value.substring(0, this.value.length - 3);
			},
			set(to) {
				this.$emit("input", `${to}000`);
			},
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
