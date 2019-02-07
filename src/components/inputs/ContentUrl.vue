<template>
	<MdField :class="{ 'md-invalid': !!error }">
		<label>{{ $lang.edit.form.url }}</label>
		<MdInput :value="value" name="url" @input="$emit('input', $event)" />
		<span class="md-error">{{ error }}</span>
	</MdField>
</template>

<script>
export default {
	props: {
		value: {
			type: String,
			required: true,
		},
		error: {
			type: String,
			default: "",
		},
	},
};
</script>
