<template>
	<BaseInput
		:value="value"
		:label="getLabel"
		:error="error"
		name="title"
		type="text"
		placeholder="Malen nach Zahlen"
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
			if (!this.withoutLabel) return this.$lang.edit.form.title;
			else return "";
		},
	},
};
</script>
