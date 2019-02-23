<template>
	<MdField>
		<label for="contentHosting">
			{{ $lang.edit.form.hosting }}
		</label>
		<MdSelect
			id="contentHosting"
			:value="value"
			name="contentHosting"
			@input="$emit('input', $event)"
		>
			<MdOption value="hostedExternally">Selber hosten</MdOption>
			<MdOption value="hostedAtSchulcloud">Bei der Schul-Cloud hosten</MdOption>
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
	},
};
</script>
