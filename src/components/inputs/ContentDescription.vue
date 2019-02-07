<template>
	<MdField :class="{ 'md-invalid': !!error }">
		<label>
			{{ $lang.edit.form.description }}
			<span>
				<MdIcon>help</MdIcon>
				<MdTooltip md-direction="right">
					{{ $lang.edit.form.description_tooltip }}
				</MdTooltip>
			</span>
		</label>
		<MdTextarea
			:value="value"
			name="description"
			maxlength="500"
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
