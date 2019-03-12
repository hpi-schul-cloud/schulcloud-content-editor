<template>
	<VueTagsInput
		v-model="newTag"
		class="tag-input"
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
.no-numbers {
	color: red;
}
.vue-tags-input {
	// background: white;
	color: #1d1d1d;
	border-radius: 20px;
}
</style>
