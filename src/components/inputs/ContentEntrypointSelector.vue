<template>
	<MdField>
		<label for="contentEntrypointSelector">
			{{ $lang.edit.form.entrypointSelector }}
		</label>
		<MdSelect
			id="contentEntrypointSelector"
			:value="value"
			name="contentEntrypointSelector"
			:disabled="disabled"
			@input="$emit('input', $event)"
		>
			<MdOption
				v-for="file in files"
				:key="file"
				:value="'http://127.0.0.1:4040/files/get/' + contentID + '/' + file"
				>{{ file }}</MdOption
			>
		</MdSelect>
	</MdField>
</template>

<script>
export default {
	props: {
		value: {
			type: String,
			default: "",
			required: true,
		},
		disabled: Boolean,
		files: Array,
		contentID: String,
	},
};
</script>
