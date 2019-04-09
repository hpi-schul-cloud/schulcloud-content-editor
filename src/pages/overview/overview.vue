<template>
	<AppSearch />
</template>

<script>
import search from "./search.vue";

export default {
	name: "Overview",
	components: {
		AppSearch: search,
	},
	created() {
		const config = {
			path: this.$route.path,
			actions: [
				{
					title: "Inhalt erstellen",
					icon: "create",
					event: "create",
					payload: { name: "createResource" },
				},
				{
					title: "Inhalte importieren",
					icon: "import_export",
					event: "import",
					payload: {},
				},
			],
		};
		this.$store.commit("ui/registerFab", config);
		this.$eventHub.$on("create", this.navigate);
	},
	methods: {
		navigate(target) {
			this.$router.push(target);
		},
	},
};
</script>
