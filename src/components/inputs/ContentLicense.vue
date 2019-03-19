<template>
	<section>
		<CustomChipInput
			:value="value"
			:label="$lang.edit.form.license"
			:placeholder="$lang.edit.form.license + '... (max. 10)'"
			:max="10"
			@input="$emit('input', $event)"
		/>
	</section>
</template>

<script>
import CustomChipInput from "@/components/base/BaseTags.vue";

export default {
	components: {
		CustomChipInput,
	},
	props: {
		value: {
			type: Array,
			default: () => [],
		},
	},
};
</script>
