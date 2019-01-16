<template>
  <MdCard
    v-if="isFirstView"
    id="welcomeCard"
    class="card-content"
  >
    <MdCardHeader>
      <h2
        id="welcomeMessage"
        class="md-title"
      >
        {{ $lang.welcome.message }}
      </h2>
    </MdCardHeader>
  </MdCard>
</template>

<script>
export default {
	name: 'WelcomeMessage',
	data() {
		return {
			isFirstView: true,
		};
	},
	created() {
		const viewedString = 'alreadyViewed';
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
  #welcomeMessage {
    text-align: center;
  }

  #welcomeCard {
    background-color: rgba(211, 211, 211, 0.5);
  }
</style>
