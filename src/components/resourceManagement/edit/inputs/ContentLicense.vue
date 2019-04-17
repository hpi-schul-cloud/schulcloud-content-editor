<template>
	<section>
		<CustomChipInput
			:value="value"
			:label="getLabel"
			:placeholder="$lang.edit.form.license + '... (max. 10)'"
			:max="10"
			@input="$emit('input', $event)"
		/>
	</section>
</template>

<script>
import CustomChipInput from "@/components/base/BaseTags";

export default {
	components: {
		CustomChipInput,
	},
	props: {
		value: {
			type: Array,
			default: () => [],
		},
		withoutLabel: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		getLabel: function() {
			if (!this.withoutLabel) return this.$lang.edit.form.license;
			else return "";
		},
	},
};
</script>
