<template>
	<div v-if="showFab">
		<FAB :isOpen.sync="fabOpen" :config="fabConfig" @click="handleClick" />
		<transition name="fade">
			<div v-if="fabOpen" @click="fabOpen = false" class="overlay" />
		</transition>
	</div>
</template>

<script>
import FAB from "@/components/base/FAB";

export default {
	components: {
		FAB,
	},
	data() {
		return {
			fabOpen: false,
		};
	},
	computed: {
		showFab() {
			return !!this.fabActions.length;
		},
		fabActions() {
			return this.$store.getters["ui/GET_FAB_ACTIONS"](this.$route.path).map(
				(action) => {
					return {
						...action,
						payload: {
							event: action.event,
							payload: action.payload,
						},
						event: "click",
					};
				}
			);
		},
		primaryColor() {
			return getComputedStyle(document.documentElement).getPropertyValue(
				"--primaryColor"
			);
		},

		fabConfig() {
			const defaultConfig = {
				icon: "add",
				background: this.primaryColor,
				color: "#fff",
				options: [],
			};
			if (this.fabActions.length === 1) {
				const { icon, event, payload } = this.fabActions[0];
				return {
					...defaultConfig,
					icon,
					event,
					payload,
				};
			}
			return {
				...defaultConfig,
				options: this.fabActions,
			};
		},
	},
	methods: {
		handleClick({ event, payload }) {
			this.$eventHub.$emit(event, payload);
		},
	},
};
</script>
<style lang="scss" scoped>
.overlay {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 2;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.3);
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
