<template>
  <md-card v-if="isFirstView" class="card-content" id="welcomeCard">
    <md-card-header>
      <h2 id="welcomeMessage" class="md-title">{{$lang.welcome.message}}</h2>
    </md-card-header>
  </md-card>
</template>

<script>
  export default {
    name: 'welcomeMessage',
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
