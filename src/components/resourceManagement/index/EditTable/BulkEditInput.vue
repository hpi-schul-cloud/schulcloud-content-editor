<template>
	<div class="table-cell">
		<TableInput
			v-model="input"
			:label="attribute"
			:attribute="attribute"
			:name="attribute"
			:class="{ input: true, invisible: !active }"
		/>
		<input
			v-model="active"
			:disabled="isInputRequired && validateRequired && !isInputDefined"
			class="active-toggle"
			type="checkbox"
		/>
	</div>
</template>

<script>
import TableInput from "./TableInput";
import { keyInputMapping } from "./EditTableRow";

export default {
	components: {
		TableInput,
	},
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
			type: [String, Number, Array, Boolean, Object],
			default: undefined,
		},
		validateRequired: {
			type: Boolean,
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
		isInputRequired(key) {
			return this.getComponent(this.attribute).required;
		},
		isInputDefined() {
			return this.isDefined(this.input);
		},
	},
	watch: {
		input(value) {
			const newVal = this.isDefined(value) ? value : undefined;
			this.$emit("update", newVal);
			this.active = !!newVal;
		},
		active(isActive) {
			const value = this.isDefined(this.input)
				? this.input
				: this.deepCopy(this.emptyValue);
			this.$emit("update", isActive ? value : undefined);
		},
	},
	methods: {
		getComponent(key) {
			return keyInputMapping.find((coloumn) => coloumn.key === key);
		},
		isDefined(val) {
			return (
				typeof val === "boolean" ||
				((typeof val === "string" || Array.isArray(val)) && val.length > 0)
			);
		},
		deepCopy(obj) {
			return typeof obj === "object" ? JSON.parse(JSON.stringify(obj)) : obj;
		},
	},
};
</script>

<style lang="scss" scoped>
.table-cell {
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	.input {
		flex: 1;
	}
	.active-toggle {
		margin: 0;
	}
}
.invisible {
	opacity: 0;
	&:focus,
	&:focus-within,
	&:hover {
		opacity: 1;
	}
}
input[type="checkbox"][disabled] {
	display: none;
}
</style>
