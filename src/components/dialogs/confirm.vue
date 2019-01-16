<template>
  <MdDialogConfirm
    :md-active.sync="isActive"
    :md-title="config.title || 'Agree/Disagree?'"
    :md-content="config.content"
    :md-confirm-text="config.confirm || 'Agree'"
    :md-cancel-text="config.cancle || 'Disagree'"
    @md-cancel="onCancel"
    @md-confirm="onConfirm"
  />
</template>

<script>
export default {
	name: 'DialogConfirm',
	props: {
		config: {
			type: Object,
			required: true
		},
	},
	data() {
		return {
			isActive: false,
		};
	},
	watch: {
		'config.active': function (to) {
			this.isActive = to;
		},
	},
	methods: {
		onConfirm() {
			this.$emit('confirm');
			if (this.config.onConfirm) {
				this.config.onConfirm();
			}
		},
		onCancel() {
			this.$emit('cancle');
			if (this.config.onCancle) {
				this.config.onCancle();
			}
		},
	},
};
</script>
