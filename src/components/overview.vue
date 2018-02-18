<template>
  <div>
    <app-welcomeMessage></app-welcomeMessage>
    <app-searchContent></app-searchContent>
  </div>
</template>

<script>
  import welcomeMessage from './welcomeMessage.vue';
  /* load searchContent async */
  const searchContent = () => import(
    /* webpackChunkName: "searchContent" */ './searchContent.vue');

  export default {
    components: {
      'app-searchContent': searchContent,
      'app-welcomeMessage': welcomeMessage,
    },
    name: 'overview',
  };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
