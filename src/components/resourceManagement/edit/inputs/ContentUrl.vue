<template>
	<BaseInput
		name="url"
		:value="value"
		type="text"
		:label="getLabel"
		placeholder="https://..."
		:error="error"
		@input="$emit('input', $event)"
	/>
</template>

<script>
import BaseInput from "@/components/base/BaseInput";

export default {
	components: {
		BaseInput,
	},
	props: {
		value: {
			type: String,
			required: true,
		},
		error: {
			type: String,
			default: "",
		},
		withoutLabel: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		getLabel: function() {
			if (!this.withoutLabel) return this.$lang.edit.form.url;
			else return "";
		},
	},
};
</script>
