<template>
	<div class="wrapper">
		<label>{{ label }}</label>
		<VueTagsInput
			v-model="newTag"
			class="tag-input"
			:tags="value.map((item) => ({ text: item }))"
			:placeholder="placeholder"
			@tags-changed="tagsChanged"
		/>
	</div>
</template>

<script>
import VueTagsInput from "@johmun/vue-tags-input";

export default {
	components: {
		VueTagsInput,
	},
	props: {
		value: {
			type: Array,
			default: () => [],
		},
		label: {
			type: String,
			required: true,
		},
		placeholder: {
			type: String,
			default: "",
		},
		max: {
			type: Number,
			default: 10,
		},
	},
	data() {
		return {
			newTag: "",
			validation: [
				{
					classes: "no-numbers",
					rule: /^([^0-9]*)$/,
				},
			],
		};
	},
	methods: {
		tagsChanged(newTags) {
			this.$emit("input", newTags.map((tag) => tag.text));
			this.newTag = "";
		},
	},
};
</script>
<style lang="scss">
.wrapper {
	margin: 1.5em 0;
}
label {
	padding-left: 8px;
	font-size: 0.9em;
	font-weight: 500;
	color: black;
}
.no-numbers {
	color: red;
}
.tag-input {
	.ti-input {
		border: 0;
		border-bottom: 1px solid grey;
	}
	&.ti-focus .ti-input {
		border-color: #b10438;
	}
	&.vue-tags-input {
		// background: white;
		max-width: 100%;
		color: #1d1d1d;
		border-radius: 20px;

		.ti-new-tag-input {
			font-size: 1rem;
			color: #757575;
		}
	}
	.ti-tag {
		font-size: 1rem;
		color: #757575;
		background-color: #e7e7e7;
		border: 1px solid #333;

		&.ti-tag.ti-deletion-mark {
			color: #fff;
			background-color: var(--md-theme-default-primary);
			border-color: #fff;
		}
	}
}
</style>
