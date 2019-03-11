<template>
	<Select
		:label="$lang.edit.form.hosting"
		name="Hosting"
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
			required: true,
		},
	},
	data() {
		return {
			options: [
				{ key: "hostedExternally", value: "Selber hosten" },
				{ key: "hostedAtSchulcloud", value: "Bei der Schul-Cloud hosten" },
			],
		};
	},
};
</script>
