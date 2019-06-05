<template>
	<div>
		<BaseInput
			v-model="providerData.name"
			label="Firmenname des Anbieters"
			name="name"
			type="text"
			placeholder="Firmenname *"
			required
		/>
	</div>
</template>

<script>
import BaseInput from "@/components/base/BaseInput";

import api from "@/mixins/api.js";
import { mapActions } from "vuex";

export default {
	components: {
		BaseInput,
	},
	props: {
		value: {
			type: Object,
		},
	},
	computed: {
		providerData: {
			get() {
				return this.value;
			},
			set(providerData) {
				this.$emit("input", providerData);
			},
		},
	},
};
</script>
