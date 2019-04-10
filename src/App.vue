<template>
	<div id="app">
		<!-- eslint-disable -->
		<vue-progress-bar />
		<!--eslint-enable-->
		<TheHeader class="header" />
		<TheSidebar class="sidebar" />
		<main class="container-fluid-max">
			<Transition name="fade" mode="out-in" appear>
				<RouterView v-if="jwt" />
			</Transition>
			<TheLogin v-if="!jwt" />
		</main>
		<TheFAB />
		<TheFooter class="footer" />
	</div>
</template>

<script>
/* load login async */
const TheLogin = () => import("@/components/TheLogin.vue");
import TheHeader from "@/components/TheHeader.vue";
import TheFAB from "@/components/TheFAB.vue";
import TheSidebar from "@/components/TheSidebar.vue";
import TheFooter from "@/components/TheFooter.vue";

export default {
	name: "App",
	components: {
		TheLogin,
		TheHeader,
		TheFAB,
		TheSidebar,
		TheFooter,
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

		this.$eventHub.$on("navigate", this.navigate);
	},
	beforeDestroy() {
		this.$eventHub.$off("navigate");
	},
	methods: {
		navigate(target) {
			this.$router.push(target);
		},
	},
};
</script>

<style lang="scss">
@import "./default";

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
</style>
<style lang="scss" scoped>
#app {
	min-height: 100vh;
	padding: 0;
}
main {
	flex: 1;
	// display: contents;
	max-width: 100% !important;
	padding-top: 80px;
	padding-left: 150px;
	margin: 0 auto !important;
}

.header {
	position: fixed;
	top: 0;
	left: 150px;
	height: 80px;
	background: white;
}
.sidebar {
	position: fixed;
	top: 0;
	bottom: 0;
	width: 150px;
}
</style>
