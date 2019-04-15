<template>
	<div class="wrapper">
		<label v-if="label">{{ label }}</label>
		<VueTagsInput
			v-model="newTag"
			v-bind="$attrs"
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
<style lang="scss" scoped>
.wrapper {
	margin: 1.5em 0;
}
label {
	font-size: 0.9em;
	font-weight: 500;
	color: black;
}
.no-numbers {
	color: red;
}
</style>
<style lang="scss">
.tag-input {
	.ti-input {
		padding: 1px 0;
		border: 0;
		border-bottom: 1px solid grey;
	}
	&.ti-focus .ti-input {
		border-color: var(--primaryColor);
	}
	&.vue-tags-input {
		max-width: 100%;
		color: #1d1d1d;
		background: none;
		border-radius: 20px;

		.ti-new-tag-input-wrapper {
			padding: 0;

			.ti-new-tag-input {
				font-size: 1rem;
				color: #757575;
				background: none;
			}
		}
	}
	.ti-tag {
		font-size: 1rem;
		color: #757575;
		background-color: #e7e7e7;
		border: 1px solid #333;

		&.ti-tag.ti-deletion-mark {
			color: #fff;
			background-color: var(--primaryColor);
			border-color: #fff;
		}
	}
}
</style>
