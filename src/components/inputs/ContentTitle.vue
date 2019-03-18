<template>
	<BaseInput
		name="title"
		:value="value"
		type="text"
		:label="$lang.edit.form.title"
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
	},
};
</script>
