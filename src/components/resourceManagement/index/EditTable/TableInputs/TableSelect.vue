<template>
	<select
		ref="select"
		:aria-label="label"
		v-bind="$attrs"
		:class="{ 'table-select': true, multiple: multiple }"
		:multiple="multiple"
		@change="handleChange"
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
	model: {
		prop: "value",
		event: "update",
	},
	props: {
		options: {
			type: Array,
			default: () => [],
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
		multiple: {
			type: Boolean,
		},
	},
	methods: {
		handleChange(event) {
			this.$emit(
				"update",
				this.multiple
					? this.getSelectValues(this.$refs.select)
					: event.target.value
			);
		},
		getSelectValues(select) {
			var result = [];
			var options = select && select.options;
			var opt;

			for (var i = 0, iLen = options.length; i < iLen; i++) {
				opt = options[i];

				if (opt.selected) {
					result.push(opt.value || opt.text);
				}
			}
			return result;
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
	&.multiple {
		height: 2em;
		&:focus {
			height: 7em;
		}
	}
	option:checked {
		color: white;
		background: var(--color-primary);
	}
}
</style>
