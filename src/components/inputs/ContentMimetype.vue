<template>
	<MdField>
		<label for="contentMimetype">
			{{ $lang.edit.form.mimetype }}
		</label>
		<MdSelect
			id="contentMimetype"
			:value="value"
			name="contentCategory"
			@input="$emit('input', $event)"
		>
			<MdOption value="application">application</MdOption>
			<MdOption value="audio">audio</MdOption>
			<MdOption value="example">example</MdOption>
			<MdOption value="image">image</MdOption>
			<MdOption value="message">message</MdOption>
			<MdOption value="model">model</MdOption>
			<MdOption value="multipart">multipart</MdOption>
			<MdOption value="text">text</MdOption>
			<MdOption value="video">video</MdOption>
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
