<template>
  <div>
    <app-welcomeMessage></app-welcomeMessage>
    <app-search></app-search>
  </div>
</template>

<script>
  const welcomeMessage = () => import(/* webpackChunkName: "welcomeMessage" */ '@/components/base/welcomeMessage.vue');
  const search = () => import(/* webpackChunkName: "search" */ './search.vue');

  export default {
    components: {
      'app-search': search,
      'app-welcomeMessage': welcomeMessage,
    },
    name: 'overview',
  };
</script>
