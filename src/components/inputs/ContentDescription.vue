<template>
	<BaseTextarea
		:value="value"
		name="description"
		:label="$lang.edit.form.description"
		maxlength="500"
		:error="error"
		@input="$emit('input', $event)"
	/>
</template>

<script>
import BaseTextarea from "@/components/base/html/BaseTextarea.vue";

export default {
	components: {
		BaseTextarea,
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
	},
};
</script>
