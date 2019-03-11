<template>
	<Select
		:label="$lang.edit.form.mimetype"
		name="Mimetype"
		:options="options"
		:selected="value"
		@input="$emit('input', $event)"
	/>
</template>

<script>
import Select from "@/components/base/select.vue";

export default {
	components: {
		Select,
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
