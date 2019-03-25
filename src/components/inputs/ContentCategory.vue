<template>
	<div class="wrapper">
		<BaseSelect
			:label="$lang.edit.form.categorie"
			name="Kategorie"
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
				{ key: "atomic", value: "Atomic" },
				{ key: "learning-object", value: "Lernobjekt" },
				{ key: "proven-learning-object", value: "Bewährtes Lernobjekt" },
				{ key: "tool", value: "Tool" },
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
