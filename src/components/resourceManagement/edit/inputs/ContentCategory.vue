<template>
	<div class="wrapper">
		<BaseSelect
			:label="getLabel"
			name="Kategorie"
			:options="options"
			:selected="value"
			@input="$emit('input', $event)"
		/>
	</div>
</template>

<script>
import BaseSelect from "@/components/base/BaseSelect";

export const options = [
	{ key: "atomic", value: "Atomic" },
	{ key: "learning-object", value: "Lernobjekt" },
	{ key: "proven-learning-object", value: "Bewährtes Lernobjekt" },
	{ key: "tool", value: "Tool" },
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
		withoutLabel: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			options,
		};
	},
	computed: {
		getLabel: function() {
			if (!this.withoutLabel) return this.$lang.edit.form.categorie;
			else return "";
		},
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	margin: 1.5em 0;
}
</style>
