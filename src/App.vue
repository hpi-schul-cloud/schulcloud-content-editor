<template>
	<div id="app">
		<!-- eslint-disable -->
		<vue-progress-bar />
		<!--eslint-enable-->
		<TheHeader />
		<main class="container-fluid-max">
			<Transition name="fade" mode="out-in" appear>
				<RouterView v-if="jwt" />
			</Transition>
			<AppLogin v-if="!jwt" />
		</main>
		<TheFAB />
		<TheFooter />
	</div>
</template>

<script>
/* load login async */
const login = () => import("@/components/login.vue");
import TheFooter from "@/components/TheFooter.vue";
import TheHeader from "@/components/TheHeader.vue";
import TheFAB from "@/components/TheFAB.vue";

export default {
	name: "App",
	components: {
		AppLogin: login,
		TheFooter,
		TheFAB,
		TheHeader,
	},
	data() {
		return {
			jwt: localStorage.getItem("jwt"),
			primaryColor: getComputedStyle(document.documentElement).getPropertyValue(
				"--primaryColor"
			),
		};
	},
	created() {
		this.$Progress.start();

		this.$router.beforeEach((to, from, next) => {
			this.$Progress.start();
			next();
		});

		this.$router.afterEach(() => {
			this.$Progress.finish();
		});
	},
};
</script>

<style lang="scss">
@import "./default";
#app {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	padding: 0;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu,
		"Helvetica Neue", Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}

main {
	flex: 1;
	// display: contents;
	max-width: 100% !important;
	padding: 0;
	margin: 0 auto !important;
}
</style>
