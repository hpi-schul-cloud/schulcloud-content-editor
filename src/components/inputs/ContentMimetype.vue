<template>
	<div class="wrapper">
		<BaseSelect
			:label="$lang.edit.form.mimetype"
			name="Mimetype"
			:options="options"
			:selected="value"
			@input="$emit('input', $event)"
		/>
	</div>
</template>

<script>
import BaseSelect from "@/components/base/BaseSelect.vue";

export default {
	components: {
		BaseSelect,
	},
	props: {
		value: {
			type: String,
			default: "",
		},
	},
	data() {
		return {
			options: [
				{ key: "application", value: "application" },
				{ key: "audio", value: "audio" },
				{ key: "example", value: "example" },
				{ key: "image", value: "image" },
				{ key: "message", value: "message" },
				{ key: "model", value: "model" },
				{ key: "multipart", value: "multipart" },
				{ key: "text", value: "text" },
				{ key: "video", value: "video" },
			],
		};
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	margin: 1.5em 0;
}
</style>
