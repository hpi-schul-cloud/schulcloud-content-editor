<template>
	<BaseTextarea
		:value="value"
		:label="$lang.edit.form.description"
		:error="error"
		@input="$emit('input', $event)"
		name="description"
		placeholder="Die Sets umfassen eine Maltafel mit nummerierten Malfeldern, Acrylfarben und Pinsel. ..."
		maxlength="500"
	/>
</template>

<script>
import BaseTextarea from "@/components/base/BaseTextarea";

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
