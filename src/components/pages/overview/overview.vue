<template>
	<div>
		<AppWelcomeMessage />
		<AppSearch />
	</div>
</template>

<script>
const welcomeMessage = () =>
	import(/* webpackChunkName: "welcomeMessage" */ "@/components/base/welcomeMessage.vue");
const search = () => import(/* webpackChunkName: "search" */ "./search.vue");

export default {
	name: "Overview",
	components: {
		AppSearch: search,
		AppWelcomeMessage: welcomeMessage,
	},
};
</script>
