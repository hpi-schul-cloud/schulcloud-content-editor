<template>
	<div class="wrapper">
		<BaseInput
			name="thumbnail"
			:value="value"
			type="text"
			:label="$lang.edit.form.thumbnail_url"
			placeholder="https://..."
			:error="error"
			@input="$emit('input', $event)"
		/>
	</div>
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

<style lang="scss" scoped>
.wrapper {
	margin: 1.5em 0;
}
</style>
