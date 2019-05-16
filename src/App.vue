<template>
	<div id="app">
		<!-- eslint-disable -->
		<vue-progress-bar />
		<!--eslint-enable-->
		<TheHeader class="header" />
		<TheSidebar :items="sidebarItems" class="sidebar" />
		<main class="container-fluid-max">
			<Transition name="fade" mode="out-in" appear>
				<RouterView v-if="jwt" />
			</Transition>
			<TheLogin v-if="!jwt" />
		</main>
		<TheFAB />
		<TheFooter class="footer" />

		<portal-target name="app"></portal-target>
	</div>
</template>

<script>
/* load login async */
const TheLogin = () => import("@/components/app/TheLogin");
import TheHeader from "@/components/app/TheHeader";
import TheFAB from "@/components/app/TheFAB";
import TheSidebar from "@/components/app/TheSidebar";
import TheFooter from "@/components/app/TheFooter";
import Router from "@/router/index.js";

const sidebarItems = Router.options.routes.filter((route) => {
	return !!route.sidebarTitle;
});

export default {
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
			sidebarItems,
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
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	padding: 0;
}

$header-height: 56px;

main {
	flex: 1;
	// display: contents;
	max-width: 100% !important;
	padding-top: $header-height;
	padding-right: 25px;
	padding-left: 200px;
	margin: 0 auto !important;
}

.header {
	position: fixed;
	top: 0;
	height: $header-height;
	background: white;
	box-shadow: 0 2px 8px 0 rgb(140, 139, 139);
}
.sidebar {
	position: fixed;
	top: $header-height;
	bottom: 0;
	width: 175px;
}
.footer {
	padding-left: 175px;
}
</style>
