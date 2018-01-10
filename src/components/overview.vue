<template>
    <div>
        <app-contentStats></app-contentStats>
        <app-searchContent></app-searchContent>
    </div>
</template>

<script>
import contentStats from './contentStats.vue';
/* load searchContent async */
const searchContent = () => import(
    /* webpackChunkName: "searchContent" */ './searchContent.vue'
);

export default {
  components: {
    'app-contentStats': contentStats,
    'app-searchContent': searchContent
  },
  name: 'overview',
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
