<template>
	<div>
		<BaseInput
			v-model="value.exif.CreatorAddress"
			name="exif"
			type="text"
			:label="'CreatorAddress'"
			placeholder="Insert Creators Address"
			:error="error"
		/>
		<BaseInput
			v-model="value.exif.Description"
			name="exif2"
			type="text"
			:label="'Description'"
			placeholder="Insert your Description"
			:error="error"
		/>
		<BaseInput
			v-model="value.exif.CreatorWorkURL"
			name="exif3"
			type="text"
			:label="'CreatorWorkURL'"
			placeholder="Insert your URL"
			:error="error"
		/>
	</div>
</template>

<script>
import BaseInput from "@/components/base/BaseInput";
import BaseCheckbox from "@/components/base/BaseCheckbox";
export default {
	components: {
		BaseInput,
	},
	props: {
		value: {
			type: Object,
			required: true,
		},
		error: {
			type: String,
			default: "",
		},
		withoutLabel: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		getLabel: function() {
			if (!this.withoutLabel) return this.$lang.edit.form.drmOptions;
			else return "";
		},
	},
	methods: {
		say: function(msg) {
			alert(msg);
			awesome = false;
		},
	},
	awesome: function() {
		return {
			count: 0,
		};
	},
};
</script>
