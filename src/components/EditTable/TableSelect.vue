<template>
	<select
		:aria-label="label"
		v-bind="$attrs"
		class="table-select"
		@change="$emit('update', $event.target.value)"
	>
		<option
			v-for="option in options"
			:key="option.value"
			:selected="option.key === value"
		>
			{{ option.key }}
		</option>
	</select>
</template>

<script>
export default {
	name: "BaseSelect",
	props: {
		options: {
			type: Array,
			default: () => [],
			required: true,
		},
		label: {
			type: String,
			default: "",
			required: true,
		},
		value: {
			type: String,
			default: "",
		},
	},
	data() {
		return {
			expanded: false,
		};
	},
	methods: {
		expandSelect(event) {
			this.expanded = !this.expanded;
		},
		selectOption(option) {
			this.$emit("input", option.key);
			this.expanded = false;
		},
		getContent() {
			if (this.selected === undefined) return this.name;
			else {
				let selectedObject = this.options.find((elem) => {
					return elem.key === this.selected;
				});
				if (selectedObject) return selectedObject.value;
				else return this.name;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.table-select {
	width: 100%;
	background: transparent;
	border: 0;
	&:focus {
		outline: none;
	}
}
</style>
