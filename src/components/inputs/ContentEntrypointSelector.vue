<template>
	<CustomSelect
		:label="$lang.edit.form.entrypointSelector"
		name="Entrypoint"
		:options="getOptions()"
		:selected="value"
		:disabled="disabled || !files.length"
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
			required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		files: {
			type: Array,
			default: () => [],
		},
		contentID: {
			type: String,
			default: "",
		},
	},
	methods: {
		getOptions() {
			let options = this.files.map((elem) => {
				let obj = {};
				const key =
					this.$config.API.contentServerUrl +
					this.$config.API.hostingEntry +
					this.contentID +
					"/" +
					elem;
				obj.key = key;
				obj.value = elem;
				return obj;
			});
			return options;
		},
	},
};
</script>
