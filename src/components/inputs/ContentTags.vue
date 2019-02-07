<template>
	<section>
		<MdChips
			id="tags"
			:value="value"
			:md-max="10"
			:md-placeholder="
				$lang.edit.form.tags + '... (' + $lang.edit.form.max + ' 10)'
			"
			@input="$emit('input', $event)"
		/>
	</section>
</template>

<script>
export default {
	props: {
		value: {
			type: Array,
			default: () => [],
		},
	},
};
</script>
