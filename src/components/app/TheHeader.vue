<template>
	<header>
		<span class="logo">
			<img src="@/assets/cloud-transparent.svg" alt="HPI Schul-Cloud Logo" />
		</span>
		<RouterLink to="/" style="flex: 1">
			<h2 class="title" style="flex: 1">{{ title }}</h2>
		</RouterLink>
		<div id="button-wrapper" v-if="jwt">
			<BaseMenu :options="MenuOptions" @input="handleMenuClick($event)">
				<img
					src="http://i.pravatar.cc/50"
					class="user-avatar"
					alt="random user avatar"
				/>
			</BaseMenu>
		</div>
	</header>
</template>

<script>
import BaseMenu from "@/components/base/BaseMenu";
import { mapGetters, mapActions } from "vuex";

export default {
	components: {
		BaseMenu,
	},
	data() {
		return {
			title: "Schul-Cloud Content",
		};
	},
	computed: {
		...mapGetters("user", {
			jwt: "GET_JWT",
			userInfo: "GET_USER",
		}),
		MenuOptions() {
			return [
				{ text: this.userInfo.forename + " " + this.userInfo.familyname },
				{ text: this.$lang.buttons.logout, actionOnClick: "logout" },
			];
		},
	},
	created() {
		this.$eventHub.$on("abc", this.logEvent);
	},
	beforeDestroy() {
		this.$eventHub.$off("abc");
	},
	methods: {
		...mapActions("user", {
			logout: "LOGOUT",
		}),
		logEvent() {
			this.$router.go("/event");
		},
		handleMenuClick(ev) {
			if (ev.actionOnClick) {
				this[ev.actionOnClick]();
			}
		},
	},
};
</script>

<style lang="scss" scoped>
header {
	top: 0;
	left: 0;
	z-index: 3;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
		0 1px 3px 0 rgba(0, 0, 0, 0.12);

	@media (max-width: 730px) {
		justify-content: space-around;
	}

	a {
		text-decoration: none;

		&:hover {
			text-decoration: none;
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

.logo {
	display: flex;
	justify-content: center;
	width: 175px;
	height: 100%;

	img {
		padding: 8px;
		object-fit: contain;
	}
}

.title {
	margin: 0;
	font-size: 32px;
	font-weight: 500;
	font-weight: lighter;
	line-height: 26px;
	color: #333;

	@media (max-width: 730px) {
		text-align: center;
	}
}

.user-avatar {
	border-radius: 50%;
}
</style>
