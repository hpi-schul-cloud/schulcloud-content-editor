<template>
	<BaseInput
		name="title"
		:value="value"
		type="text"
		:label="getLabel"
		placeholder="Malen nach Zahlen"
		:error="error"
		@input="$emit('input', $event)"
	/>
</template>

<script>
import BaseInput from "@/components/base/BaseInput.vue";

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
