<template>
	<vue-fab
		v-if="showFab"
		:main-btn-color="primaryColor"
		:scroll-auto-hide="false"
	>
		<fab-item
			v-for="(action, index) in fabActions"
			:key="action.title"
			:idx="index"
			:title="action.title"
			:icon="action.icon"
			@clickItem="clickItem(action.event, action.payload)"
		/>
	</vue-fab>
</template>

<script>
export default {
	data() {
		return {
			primaryColor: getComputedStyle(document.documentElement).getPropertyValue(
				"--primaryColor"
			),
		};
	},
	computed: {
		fabActions() {
			return this.$store.getters["ui/fabActions"](this.$route.path);
		},
		showFab() {
			return this.$store.getters["ui/isFabVisible"](this.$route.path);
		},
	},
	methods: {
		clickItem(event, payload) {
			this.$eventHub.$emit(event, payload);
		},
	},
};
</script>
