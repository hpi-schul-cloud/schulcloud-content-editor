<template>
	<BaseSelect
		:label="$lang.edit.form.categorie"
		name="Kategorie"
		:options="options"
		:selected="value"
		@input="$emit('input', $event)"
	/>
</template>

<script>
import BaseSelect from "@/components/base/html/BaseSelect.vue";

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
				{ key: "atomic", value: "Atomic" },
				{ key: "learning-object", value: "Lernobjekt" },
				{ key: "proven-learning-object", value: "Bewährtes Lernobjekt" },
				{ key: "tool", value: "Tool" },
			],
		};
	},
};
</script>
