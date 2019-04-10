<template>
	<nav class="sidebar">
		<ul class="sidebar-list">
			<li class="logo">
				<img src="@/assets/cloud-transparent.svg" />
			</li>
			<li
				v-for="entry in sidebarEntries"
				:key="entry.title"
				class="sidebar-entry"
			>
				<RouterLink :to="entry.to" class="link">
					<i class="material-icons">
						{{ entry.icon }}
					</i>
					{{ entry.title }}
				</RouterLink>
			</li>
		</ul>
	</nav>
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
		sidebarEntries() {
			return this.$store.getters["ui/getSidebar"];
		},
	},
};
</script>
<style lang="scss" scoped>
nav {
	box-shadow: 2px 3px 8px 0 rgba(199, 199, 199, 1);
}
.sidebar-list {
	padding: 0;
	margin-top: 0;
	list-style-type: none;
}
.sidebar-entry {
	.link {
		display: flex;
		align-items: center;
		padding: 8px;
		color: black;
		text-decoration: none;

		i {
			margin-right: 8px;
		}

		&.router-link-active {
			color: white;
			background-image: linear-gradient(
				to right,
				var(--primaryColor),
				var(--accentColor)
			);
		}
	}

	&:hover {
		background: #ccc;
	}
}
.logo {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 80px;
}
</style>
