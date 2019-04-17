<template>
	<div class="menu-wrapper">
		<button
			type="button"
			:class="{
				select_button: true,
				expand: expanded,
			}"
			@click="toggleExpansion"
		>
			<slot>
				<slot name="MenuTitle" />
				<i :class="{ 'material-icons': true, rotate: expanded }">
					arrow_drop_down
				</i>
			</slot>
		</button>
		<ul class="select">
			<li
				v-for="option in options"
				:key="option.text"
				:class="{ option: true, selected: option.text === selected }"
				@click="selectOption(option)"
			>
				{{ option.text }}
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: "BaseMenu",
	props: {
		options: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			expanded: false,
			selected: "",
		};
	},
	methods: {
		toggleExpansion(event) {
			this.expanded = !this.expanded;
		},
		selectOption(option) {
			this.selected = option.text;
			this.$emit("input", option);
			this.expanded = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.menu-wrapper {
	position: relative;
	display: inline-block;
	margin: 0 8px;
}
.select_button {
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-width: 100%;
	padding: 8px 16px;
	font-family: inherit;
	font-size: 14px;
	font-weight: 500;
	text-transform: uppercase;
	cursor: pointer;
	background: transparent;
	border: none;
	border-radius: 2px;

	.rotate {
		transform: rotate(180deg);
	}
}
.select {
	position: absolute;
	right: 0;
	z-index: 99;
	display: none;
	padding: 0;
	margin: 0;
	color: black;
	list-style-type: none;
	cursor: pointer;
	background: #fff;
	border-top: none;
	box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
		0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
}
.expand + .select {
	display: block;
}
.option {
	padding: 16px;
	font-size: 16px;
	font-weight: 400;
	text-align: right;
	white-space: nowrap;

	&:hover {
		background: #e0e0e0;
	}
}
.selected {
	color: var(--primaryColor);
}
</style>
