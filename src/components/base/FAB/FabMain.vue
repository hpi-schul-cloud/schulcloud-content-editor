<template>
	<div
		v-ripple
		v-bind="$attrs"
		class="fab-container"
		:class="{ open }"
		:style="{ background: config.background, color: config.color }"
		v-on="$listeners"
	>
		<transition name="spin" mode="out-in">
			<i
				:key="open"
				:class="{
					'fab-icon': true,
					'material-icons': true,
					'fab-icon--close': open,
				}"
			>
				{{ open ? "add" : config.icon }}
			</i>
		</transition>
	</div>
</template>

<script>
export default {
	props: {
		config: {
			type: Object,
			required: true,
		},
		open: {
			type: Boolean,
		},
	},
};
</script>

<style lang="scss" scoped>
.fab-container {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 56px;
	height: 56px;
	padding: 16px;
	cursor: pointer;
	border-radius: 5em;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);

	.fab-icon {
		user-select: none;
		&--close {
			transform: rotate(-45deg);
		}
		&.spin-enter-active,
		&.spin-leave-active {
			transition: opacity 0.2s, transform 0.2s;
		}
		&.spin-enter,
		&.spin-leave-to {
			opacity: 0;
			transform-origin: center;
		}
		&.spin-enter {
			transform: rotate(-90deg);
		}
		&.spin-leave-to {
			transform: rotate(90deg);
		}
	}
}
</style>
