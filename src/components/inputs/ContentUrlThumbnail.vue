<template>
	<BaseInput
		name="thumbnail"
		:value="value"
		type="text"
		:label="$lang.edit.form.thumbnail_url"
		:error="error"
		@input="$emit('input', $event)"
	/>
</template>

<script>
import BaseInput from "@/components/base/html/BaseInput.vue";

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
