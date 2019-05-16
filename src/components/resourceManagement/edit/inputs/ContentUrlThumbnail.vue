<template>
	<div class="wrapper">
		<BaseInput
			:value="value"
			:label="$lang.edit.form.thumbnail_url"
			:error="error"
			@input="$emit('input', $event)"
			name="thumbnail"
			type="text"
			placeholder="https://..."
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
	margin: 1.5em 0;
}
</style>
