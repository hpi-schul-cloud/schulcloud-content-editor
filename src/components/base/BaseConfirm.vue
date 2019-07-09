<template>
	<portal to="app">
		<transition name="fade">
			<div v-show="active" class="dialog-container" role="dialog">
				<div class="title">
					<slot name="title">{{ title }}</slot>
				</div>
				<div class="content">
					<slot>{{ content }}</slot>
				</div>
				<div v-if="cancelText || confirmText" class="action">
					<BaseButton
						v-if="cancelText"
						@click="handleCancel"
						styling="secondary"
					>
						{{ cancelText }}
					</BaseButton>
					<BaseButton
						ref="confirm"
						v-if="confirmText"
						@click="handleConfirm"
						styling="primary"
					>
						{{ confirmText }}
					</BaseButton>
				</div>
			</div>
		</transition>
		<transition name="fade">
			<div v-if="active" @click="handleCancel" class="overlay" />
		</transition>
	</portal>
</template>

<script>
import BaseButton from "@/components/base/BaseButton";
import { setTimeout } from "timers";

export default {
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
	watch: {
		active: function(to) {
			if (to) {
				setTimeout(() => {
					this.$refs.confirm.$el.focus();
				}, 300);
			}
		},
	},
	methods: {
		handleConfirm(event) {
			this.$emit("update:active", false);
			this.$emit("confirm");
		},
		handleCancel(event) {
			this.$emit("update:active", false);
			this.$emit("cancel");
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

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
