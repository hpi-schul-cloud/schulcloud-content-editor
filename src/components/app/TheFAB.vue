<template>
	<div>
		<FAB v-if="showFab" :config="fabConfig" @click="handleClick" />
	</div>
</template>

<script>
import FAB from "@/components/base/FAB";

export default {
	components: {
		FAB,
	},
	computed: {
		showFab() {
			return this.$store.getters["ui/isFabVisible"](this.$route.path);
		},
		fabActions() {
			return this.$store.getters["ui/fabActions"](this.$route.path).map(
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
