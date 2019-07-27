<template>
	<div v-click-outside="handleClickOutside" class="select-wrapper">
		<label v-if="label" :for="name">{{ label }}</label>
		<button
			:class="{
				select_button: true,
				disabled: disabled === true,
				expand: expanded,
				standalone: label === '',
			}"
			:disabled="disabled"
			@click="expandSelect"
			type="button"
		>
			{{ selection }}
			<i :class="{ 'material-icons': true, rotate: expanded }">
				arrow_drop_down
			</i>
		</button>
		<ul class="select">
			<li
				v-for="option in options"
				:key="option.key || option.value"
				:class="{
					option: true,
					selected: (option.key || option.value) === value,
					'disabled-option': disabledOptions.includes(
						option.key || option.value
					),
				}"
				:value="option.key || option.value"
			>
				<button
					:disabled="disabledOptions.includes(option.key || option.value)"
					@click="selectOption(option)"
					type="button"
				>
					{{ option.value }}
				</button>
			</li>
		</ul>
	</div>
</template>

<script>
import ClickOutside from "vue-click-outside";

export default {
	name: "BaseSelect",
	directives: {
		ClickOutside,
	},
	model: {
		prop: "value",
		event: "input",
	},
	props: {
		options: {
			type: Array,
			default: () => [],
			required: true,
		},
		disabledOptions: {
			type: Array,
			default: () => [],
			required: false,
		},
		label: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		value: {
			type: String,
			default: undefined,
			required: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			expanded: false,
		};
	},
	computed: {
		selection() {
			if (this.value === undefined) return this.name;
			else {
				let selectedObject = this.options.find((elem) => {
					return (elem.key || elem.value) === this.value;
				});
				return selectedObject ? selectedObject.value : this.name;
			}
		},
	},
	methods: {
		expandSelect(event) {
			this.expanded = !this.expanded;
		},
		handleClickOutside() {
			if (this.expanded) {
				this.expanded = false;
			}
		},
		selectOption(option) {
			this.$emit("input", option.key || option.value);
			this.expanded = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.select-wrapper {
	position: relative;
}
label {
	font-size: 0.9em;
	font-weight: 500;
	color: black;
}
.select_button {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: 1px 0;
	font-size: 1.15em;
	line-height: 32px;
	color: #757575;
	cursor: pointer;
	background: rgba(255, 255, 255, 0);
	border: none;
	border-bottom: 1px solid #949494;

	.rotate {
		transform: rotate(180deg);
	}
}
.standalone {
	font: inherit;
	font-size: inherit;
	color: #000;
	border: none;
}
.select {
	position: absolute;
	right: 0;
	left: 0;
	z-index: 999;
	display: none;
	min-width: 100px;
	padding: 0;
	margin: 0;
	list-style-type: none;
	cursor: pointer;
	background: #fff;
	border-top: none;
	box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
}
.expand {
	border-bottom-color: var(--primaryColor);
	border-bottom-width: 2px;

	+ .select {
		display: block;
	}
}
.disabled {
	color: #ccc;
	border-bottom-color: #ccc;
}
.option {
	&:hover {
		background: #e0e0e0;
	}

	button {
		display: block;
		width: 100%;
		padding: 8px;
		text-align: left;
		cursor: pointer;
		background: none;
		border: none;
	}
}
.selected {
	color: var(--primaryColor);
}
.disabled-option {
	color: red;
}
</style>
