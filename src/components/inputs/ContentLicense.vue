<template>
	<section>
		<CustomChipInput
			:value="value"
			:placeholder="$lang.edit.form.license"
			:max="10"
			@input="$emit('input', $event)"
		/>
	</section>
</template>

<script>
import CustomChipInput from "@/components/base/html/BaseTags.vue";

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
