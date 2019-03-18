<template>
	<CustomTextarea
		:value="value"
		name="description"
		:label="$lang.edit.form.description"
		maxlength="500"
		:error="error"
		@input="$emit('input', $event)"
	/>
</template>

<script>
import CustomTextarea from "@/components/base/CustomTextarea.vue";

export default {
	components: {
		CustomTextarea,
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
