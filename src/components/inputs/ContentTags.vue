<template>
	<section>
		<CustomChipInput
			:value="value"
			:placeholder="
				$lang.edit.form.tags + '... (' + $lang.edit.form.max + ' 10)'
			"
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
