<template>
	<VueTagsInput
		v-model="newTag"
		:aria-label="label"
		v-bind="$attrs"
		class="table-tag-input"
		:tags="value.map((item) => ({ text: item }))"
		:placeholder="placeholder"
		@tags-changed="tagsChanged"
	/>
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
.table-tag-input {
	overflow: auto;
	font-size: 0.8em;
	&::-webkit-scrollbar {
		width: 0;
		height: 0;
		background: transparent; /* Optional: just make scrollbar invisible */
	}
	.ti-input {
		padding: 1px 0;
		border: 0;
	}
	&.ti-focus .ti-input {
		border-color: var(--primaryColor);
	}
	&.vue-tags-input {
		max-width: 100%;
		color: #1d1d1d;
		background: none;
		border-radius: 0;
		.ti-new-tag-input-wrapper {
			padding: 0;

			.ti-new-tag-input {
				font-size: 1rem;
				color: #757575;
				background: none;
			}
		}
	}
	.ti-tags {
		flex-wrap: nowrap;
	}
	.ti-tag {
		font-size: 1em;
		color: inherit;
		background-color: transparent;
		border: 0;
		box-shadow: inset 0 0 0 1px #333;

		&.ti-tag.ti-deletion-mark {
			color: #fff;
			background-color: var(--primaryColor);
			border-color: #fff;
		}
	}
}
</style>
