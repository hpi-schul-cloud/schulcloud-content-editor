<template>
	<div class="wrapper">
		<BaseInput
			:value="value"
			:label="$lang.edit.form.thumbnail_url"
			:error="error"
			name="thumbnail"
			type="text"
			placeholder="https://..."
			@input="$emit('input', $event)"
		/>
	</div>
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
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	margin: 0.5rem 0 1rem;
}
</style>
