<template>
	<BaseCard v-if="isFirstView" id="welcome-card">
		<template slot="head">
			<h2 id="welcome-message" class="title">{{ $lang.welcome.message }}</h2>
		</template>
	</BaseCard>
</template>

<script>
import BaseCard from "@/components/base/BaseCard.vue";

export default {
	name: "WelcomeMessage",
	components: {
		BaseCard,
	},
	data() {
		return {
			isFirstView: true,
		};
	},
	created() {
		const viewedString = "alreadyViewed";
		const alreadyViewed = sessionStorage.getItem(viewedString);
		if (alreadyViewed) {
			this.isFirstView = false;
			return;
		}

		sessionStorage.setItem(viewedString, true);
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#welcome-message {
	margin: 0;
	text-align: center;
}

#welcome-card {
	background-color: rgba(211, 211, 211, 0.5);
}
</style>
