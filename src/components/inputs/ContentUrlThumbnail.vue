<template>
	<MdField :class="{ 'md-invalid': !!error }">
		<label>
			{{ $lang.edit.form.thumbnail_url }}
			<span>
				<MdIcon>help</MdIcon>
				<MdTooltip md-direction="right">
					{{ $lang.edit.form.thumbnail_url_tooptip }}
				</MdTooltip>
			</span>
		</label>
		<MdInput :value="value" name="thumbnail" @input="$emit('input', $event)" />
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
