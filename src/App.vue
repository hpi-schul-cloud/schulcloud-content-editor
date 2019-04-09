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
		<nav class="sidebar">
			<ul>
				<li v-for="entry in sidebarEntries" :key="entry.title">
					<RouterLink :to="entry.to">
						<i class="material-icons">
							{{ entry.icon }}
						</i>
						{{ entry.title }}
					</RouterLink>
				</li>
			</ul>
		</nav>
		<vue-fab
			v-if="showFab"
			:main-btn-color="primaryColor"
			:scroll-auto-hide="false"
		>
			<fab-item
				v-for="(action, index) in fabActions"
				:key="action.event"
				:idx="index"
				:title="action.title"
				:icon="action.icon"
				@clickItem="clickItem(action.event, action.payload)"
			/>
		</vue-fab>
		<TheFooter />
	</div>
</template>

<script>
/* load login async */
const login = () => import("@/components/login.vue");
import TheFooter from "@/components/TheFooter.vue";
import TheHeader from "@/components/TheHeader.vue";

export default {
	name: "App",
	components: {
		AppLogin: login,
		TheFooter,
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
	computed: {
		fabActions() {
			return this.$store.getters["ui/fabActions"](this.$route.path);
		},
		showFab() {
			return this.$store.getters["ui/isFabVisible"](this.$route.path);
		},
		sidebarEntries() {
			return this.$store.getters["ui/getSidebar"];
		},
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
	methods: {
		clickItem(event, payload) {
			this.$eventHub.$emit(event, payload);
		},
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
