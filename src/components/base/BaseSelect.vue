<template>
	<div class="select-wrapper">
		<label v-if="label" :for="name">{{ label }}</label>
		<button
			type="button"
			:class="{
				select_button: true,
				disabled: disabled === true,
				expand: expanded,
			}"
			:disabled="disabled"
			@click="expandSelect"
		>
			{{ getContent() }}
			<img
				:class="{ icon: true, rotate: expanded }"
				src="@/assets/icon-arrow_down_black.svg"
			/>
		</button>
		<ul class="select">
			<li
				v-for="option in options"
				:key="option.key"
				:class="{ option: true, selected: option.key === selected }"
				:value="option.key"
				@click="selectOption(option)"
			>
				{{ option.value }}
			</li>
		</ul>
	</div>
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
		name: {
			type: String,
			default: "",
			required: true,
		},
		selected: {
			type: String,
			default: undefined,
			required: false,
		},
		disabled: {
			type: Boolean,
			default: false,
			required: false,
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
	padding: 8px;
	&:hover {
		background: #e0e0e0;
	}
}
.selected {
	color: var(--primaryColor);
}
</style>
