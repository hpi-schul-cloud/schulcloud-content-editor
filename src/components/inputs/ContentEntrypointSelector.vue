<template>
	<BaseSelect
		:label="$lang.edit.form.entrypointSelector"
		name="Entrypoint"
		:options="options"
		:selected="value"
		:disabled="disabled || !files.length"
		@input="$emit('input', $event)"
	/>
</template>

<script>
import BaseSelect from "@/components/base/html/BaseSelect.vue";

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
		contentId: {
			type: String,
			required: true,
		},
	},
	computed: {
		options() {
			return this.files.map((elem) => {
				let obj = {};
				const key =
					this.$config.API.contentServerUrl +
					this.$config.API.hostingEntry +
					this.contentId +
					"/" +
					elem;
				obj.key = key;
				obj.value = elem;
				return obj;
			});
		},
	},
};
</script>
