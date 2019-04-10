<template>
	<nav class="sidebar">
		<ul class="sidebar-list">
			<li
				v-for="entry in items"
				:key="entry.sidebarTitle"
				class="sidebar-entry"
			>
				<RouterLink :to="entry" class="link">
					<i class="material-icons">
						{{ entry.sidebarIcon }}
					</i>
					{{ entry.sidebarTitle }}
				</RouterLink>
			</li>
		</ul>
	</nav>
</template>

<script>
export default {
	props: {
		items: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			primaryColor: getComputedStyle(document.documentElement).getPropertyValue(
				"--primaryColor"
			),
		};
	},
};
</script>
<style lang="scss" scoped>
nav.sidebar {
	z-index: 999;
	background: #4a4a4a;
	box-shadow: 2px 3px 8px 0 rgba(199, 199, 199, 1);
}
.sidebar-list {
	padding: 0;
	list-style-type: none;
}
.sidebar-entry {
	.link {
		display: flex;
		align-items: center;
		padding: 8px;
		color: white;
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
		background: #5c5c5c;
	}
}
</style>
