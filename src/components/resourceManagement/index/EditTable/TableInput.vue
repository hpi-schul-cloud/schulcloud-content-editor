<template>
	<!-- eslint-disable-next-line vue/require-component-is -->
	<component
		:is="getComponent(attribute).component"
		v-model="input"
		:label="attribute"
		:name="attribute"
		v-bind="getComponent(attribute).attributes"
	/>
</template>

<script>
import { keyInputMapping } from "./EditTableRow";

export default {
	model: {
		prop: "value",
		event: "update",
	},
	props: {
		attribute: {
			type: String,
			required: true,
			validator: (key) =>
				keyInputMapping.findIndex((a) => a.key === key) !== -1,
		},
		value: {
			type: [String, Number, Boolean, Array, Object],
			default: undefined,
		},
	},
	data() {
		return {
			active: false,
			input: this.emptyValue,
		};
	},
	computed: {
		emptyValue() {
			return this.getComponent(this.attribute).type();
		},
	},
	watch: {
		input(to) {
			this.$emit("update", to);
		},
		value(to) {
			this.input = to;
		},
	},
	methods: {
		getComponent(key) {
			return keyInputMapping.find((coloumn) => coloumn.key === key);
		},
	},
};
</script>
