<template>
	<div class="wrapper">
		<label :for="name">
			{{ label }}
		</label>
		<button
			:id="name"
			:class="{ select_button: true, disabled: disabled === true }"
			:disabled="disabled"
			@click="expandSelect"
			>{{ getContent() }}
			<img
				:id="'icon-' + name"
				class="icon"
				src="@/assets/icon-arrow_down.svg"
			/>
		</button>
		<ul class="select">
			<li
				v-for="option in options"
				:key="option.key"
				:class="{ option: true, selected: option.key === selected }"
				:value="option.key"
				@click="selectOption"
				>{{ option.value }}</li
			>
		</ul>
	</div>
</template>

<script>
export default {
	name: "Select",
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
	methods: {
		expandSelect(event) {
			event.target.classList.toggle("expand");
			event.target.querySelector(".icon").classList.toggle("rotate");
		},
		selectOption(event) {
			const option = event.target;
			this.$emit("input", option.getAttribute("value"));
			document.querySelector("#" + this.name).classList.toggle("expand");
			document
				.querySelector("#" + "icon-" + this.name)
				.classList.toggle("rotate");
		},
		getContent() {
			if (this.selected === "") return this.name;
			else return this.selected;
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
	font-size: 0.75em;
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
