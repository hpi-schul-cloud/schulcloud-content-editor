<template>
	<MdField>
		<label for="contentEntrypointSelector">
			{{ $lang.edit.form.entrypointSelector }}
		</label>
		<MdSelect
			id="contentEntrypointSelector"
			:value="value"
			name="contentEntrypointSelector"
			:disabled="disabled || !files.length"
			@input="$emit('input', $event)"
		>
			<MdOption
				v-for="file in files"
				:key="file"
				:value="
					$config.API.contentServerUrl +
						$config.API.hostingEntry +
						contentID +
						'/' +
						file
				"
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
		disabled: {
			type: Boolean,
			default: false,
		},
		files: {
			type: Array,
			default: () => [],
		},
		contentID: {
			type: String,
			default: "",
		},
	},
};
</script>
