<template>
	<div class="wrapper">
		<BaseSelect
			:label="$lang.edit.form.hosting"
			:options="options"
			:selected="value"
			@input="$emit('input', $event)"
			name="Hosting"
		/>
	</div>
</template>

<script>
import BaseSelect from "@/components/base/BaseSelect";

export default {
	components: {
		BaseSelect,
	},
	props: {
		value: {
			type: String,
			default: "",
			required: true,
		},
	},
	data() {
		return {
			options: [
				{ key: "hostedExternally", value: "Selber hosten" },
				{ key: "hostedAtSchulcloud", value: "Bei der Schul-Cloud hosten" },
			],
		};
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	margin: 1.5em 0;
}
</style>
