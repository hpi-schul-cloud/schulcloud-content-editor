<template>
	<div class="wrapper">
		<label :for="name">{{ label }}</label>
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
				src="@/assets/icon-arrow_down.svg"
			/>
		</button>
		<ul class="select">
			<li
				v-for="option in options"
				:key="option.key"
				:class="{ option: true, selected: option.key === selected }"
				:value="option.key"
				@click="selectOption(option)"
				>{{ option.value }}</li
			>
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
			default: "",
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
			if (this.selected === "") return this.name;
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
.wrapper {
	margin: 1.5em 0;
}
label {
	padding-left: 8px;
	font-size: 0.9em;
	font-weight: 500;
	color: black;
}
.select_button {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: 0 8px 8px;
	font-size: 1.15em;
	color: #757575;
	cursor: pointer;
	background: #fff;
	border: none;
	border-bottom: 1px solid #949494;

	.rotate {
		transform: rotate(180deg);
	}
}
.select {
	display: none;
	padding: 0;
	margin: 0;
	list-style-type: none;
	cursor: pointer;
	background: #fff;
	border-top: none;
	box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
}
.expand {
	border-bottom-color: #b10438;
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
	color: #b10438;
}
</style>
