<template>
	<CustomSelect
		:label="$lang.edit.form.mimetype"
		name="Mimetype"
		:options="options"
		:selected="value"
		@input="$emit('input', $event)"
	/>
</template>

<script>
import CustomSelect from "@/components/base/CustomSelect.vue";

export default {
	components: {
		CustomSelect,
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
