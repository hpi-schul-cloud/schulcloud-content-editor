<template>
	<div class="wrapper">
		<BaseSelect
			:label="$lang.edit.form.mimetype"
			:options="options"
			:selected="value"
			@input="$emit('input', $event)"
			name="Mimetype"
		/>
	</div>
</template>

<script>
import BaseSelect from "@/components/base/BaseSelect";

export const options = [
	{ key: "application", value: "application" },
	{ key: "audio", value: "audio" },
	{ key: "example", value: "example" },
	{ key: "image", value: "image" },
	{ key: "message", value: "message" },
	{ key: "model", value: "model" },
	{ key: "multipart", value: "multipart" },
	{ key: "text", value: "text" },
	{ key: "video", value: "video" },
];

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
			options,
		};
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	margin: 0.5rem 0 1rem;
}
</style>
