<template>
	<BaseSelect
		:label="$lang.edit.form.watermarkSelector"
		name="Watermark"
		:options="options"
		:selected="value"
		:disabled="disabled || !files.length"
		@input="$emit('input', $event)"
	/>
</template>

<script>
import BaseSelect from "@/components/base/BaseSelect";

export default {
	components: {
		BaseSelect,
	},
	props: {
		value: {
			type: String,
			default: "",
			required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		files: {
			type: Array,
			default: () => [],
		},
		resourceId: {
			type: String,
			required: true,
		},
	},
	computed: {
		options() {
			return [
				...this.files.map((elem) => {
					let obj = {};
					obj.key = "/" + elem;
					obj.value = elem;
					return obj;
				}),
			];
		},
	},
};
</script>
