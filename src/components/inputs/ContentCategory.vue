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
			<MdOption value>/</MdOption>
			<MdOption value="atomic">Atomic</MdOption>
			<MdOption value="interactive">Interactive</MdOption>
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
