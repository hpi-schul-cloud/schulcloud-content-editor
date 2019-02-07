<template>
	<MdField :class="{ 'md-invalid': !!error }">
		<label>{{ $lang.edit.form.title }}</label>
		<MdInput
			:value="value"
			type="text"
			name="title"
			@input="$emit('input', $event)"
		/>
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
