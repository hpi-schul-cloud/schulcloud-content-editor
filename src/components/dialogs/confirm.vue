<template>
	<BaseConfirm
		:active="isActive"
		:title="config.title || 'Agree/Disagree?'"
		:content="config.content"
		:confirm-text="config.confirm || 'Agree'"
		:cancel-text="config.cancle || 'Disagree'"
		@cancel="onCancel"
		@confirm="onConfirm"
	>
	</BaseConfirm>
</template>

<script>
import BaseConfirm from "./BaseConfirm.vue";

export default {
	name: "DialogConfirm",
	components: {
		BaseConfirm,
	},
	props: {
		config: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			isActive: false,
		};
	},
	watch: {
		"config.active": function(to) {
			this.isActive = to;
		},
	},
	methods: {
		onConfirm() {
			this.$emit("confirm");
			this.isActive = false;
			if (this.config.onConfirm) {
				this.config.onConfirm();
			}
		},
		onCancel() {
			this.$emit("cancle");
			this.isActive = false;
			if (this.config.onCancle) {
				this.config.onCancle();
			}
		},
	},
};
</script>
