<template>
	<div id="app">
		<!-- eslint-disable -->
		<vue-progress-bar />
		<!--eslint-enable-->
		<header>
			<div class="flex">
				<div id="title-wrapper">
					<RouterLink to="/" style="flex: 1">
						<div class="flex">
							<span class="logo"
								><img src="./assets/cloud-transparent-mono.svg"
							/></span>
							<h2 class="title" style="flex: 1">{{ title }}</h2>
						</div>
					</RouterLink>
				</div>
				<div v-if="jwt" id="button-wrapper">
					<RouterLink to="/create">
						<BaseButton styling="primary">{{
							$lang.buttons.create
						}}</BaseButton>
					</RouterLink>
					<RouterLink to="/stats">
						<BaseButton styling="primary">{{ $lang.buttons.stats }}</BaseButton>
					</RouterLink>
					<BaseMenu :options="MenuOptions" @input="handleMenuClick($event)">
						<template slot="MenuTitle">{{ userInfo.displayName }}</template>
					</BaseMenu>
				</div>
			</div>
		</header>
		<main class="container-fluid-max">
			<Transition name="fade" mode="out-in" appear>
				<RouterView v-if="jwt" />
			</Transition>
			<AppLogin v-if="!jwt" />
		</main>
		<AppFooter />
	</div>
</template>

<script>
/* load login async */
const login = () =>
	import(/* webpackChunkName: "login" */ "@/components/login.vue");
/* load hpiFooter async */
const hpiFooter = () =>
	import(/* webpackChunkName: "hpiFooter" */ "@/components/footer.vue");
import BaseMenu from "@/components/base/BaseMenu.vue";
import BaseButton from "@/components/base/BaseButton.vue";

export default {
	name: "App",
	components: {
		AppLogin: login,
		AppFooter: hpiFooter,
		BaseMenu,
		BaseButton,
	},
	data() {
		return {
			title: "Schul-Cloud Content",
			jwt: localStorage.getItem("jwt"),
			userInfo: JSON.parse(localStorage.getItem("userInfo")) || {},
			MenuOptions: [
				{ text: this.$lang.buttons.logout, actionOnClick: "logout" },
			],
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
	methods: {
		handleMenuClick(ev) {
			this[ev.actionOnClick]();
		},
		logout() {
			localStorage.clear();
			this.$cookies.remove("jwt");
			window.location.href = "/";
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

header {
	top: 0;
	left: 0;
	z-index: 999;
	width: 100vw;
	padding: 0 32px 0 16px !important;
	color: white;
	background: var(--primaryColor);
	box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
		0 1px 3px 0 rgba(0, 0, 0, 0.12);

	.flex {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;

		@media (max-width: 730px) {
			justify-content: space-around;
		}

		a {
			text-decoration: none;

			&:hover {
				text-decoration: none;
			}
		}
	}

	#title-wrapper {
		max-width: 300px;

		.logo {
			max-width: 50px;
			margin: 8px;

			img {
				width: 100%;
			}
		}

		.title {
			font-size: 20px;
			font-weight: 500;
			line-height: 26px;
			color: white;
			letter-spacing: 0.005em;

			@media (max-width: 730px) {
				text-align: center;
			}
		}
	}

	#button-wrapper {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		max-width: 500px;
	}
}

main {
	flex: 1;
	// display: contents;
	max-width: 100% !important;
	padding: 0;
	margin: 0 auto !important;
}
</style>
