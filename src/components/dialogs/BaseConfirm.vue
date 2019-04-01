<template>
	<div v-if="active">
		<div class="dialog-container">
			<div class="title">{{ title }}</div>
			<div class="content">{{ content }}</div>
			<div class="action">
				<BaseButton styling="secondary" @click="$emit('cancel')">
					{{ cancel_text }}
				</BaseButton>
				<BaseButton styling="primary" @click="$emit('confirm')">
					{{ confirm_text }}
				</BaseButton>
			</div>
		</div>
		<div class="overlay"></div>
	</div>
</template>

<script>
import BaseButton from "@/components/base/BaseButton.vue";

export default {
	name: "BaseConfirm",
	components: {
		BaseButton,
	},
	props: {
		active: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: "",
		},
		content: {
			type: String,
			default: "",
		},
		confirmText: {
			type: String,
			default: "",
		},
		cancelText: {
			type: String,
			default: "",
		},
	},
};
</script>

<style lang="scss" scoped>
.overlay {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 5;
	overflow: hidden;
	background: rgba(0, 0, 0, 0.6);
}

.dialog-container {
	position: fixed;
	top: 50%;
	left: 50%;
	z-index: 99;
	max-width: 600px;
	padding: 24px;
	background: #fff;
	border-radius: 2px;
	box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2),
		0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);
	transform: translate(-50%, -50%);

	.title {
		margin: 8px 0 16px 0;
		font-size: 2em;
		line-height: 1.1em;
	}
	.content {
		margin: 16px 0;
	}
	.action {
		display: flex;
		justify-content: flex-end;
		margin: 32px 0 0;
	}
}
</style>
