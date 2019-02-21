<template>
	<MdField>
		<label for="contentCategory">
			{{ $lang.edit.form.categorie }}
		</label>
		<MdSelect
			id="contentCategory"
			:value="value"
			name="contentCategory"
			@input="$emit('input', $event)"
		>
			<MdOption value="atomic">Atomic</MdOption>
			<MdOption value="learning-object">Lernobjekt</MdOption>
			<MdOption value="proven-learning-object">Bewährtes Lernobjekt</MdOption>
			<MdOption value="tool">Tool</MdOption>
		</MdSelect>
	</MdField>
</template>

<script>
export default {
	props: {
		value: {
			type: String,
			default: "",
		},
	},
};
</script>
