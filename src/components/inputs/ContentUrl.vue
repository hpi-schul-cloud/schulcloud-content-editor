<template>
	<BaseInput
		name="url"
		:value="value"
		type="text"
		:label="$lang.edit.form.url"
		placeholder="https://..."
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
