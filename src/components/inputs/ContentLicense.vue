<template>
	<section>
		<MdChips
			id="license"
			:value="value"
			:md-max="10"
			:md-placeholder="$lang.edit.form.license"
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
