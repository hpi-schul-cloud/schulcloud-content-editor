<template>
	<CustomInput
		name="title"
		:value="value"
		type="text"
		:label="$lang.edit.form.title"
		:error="error"
		@input="$emit('input', $event)"
	/>
</template>

<script>
import CustomInput from "@/components/base/CustomInput.vue";

export default {
	components: {
		CustomInput,
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
