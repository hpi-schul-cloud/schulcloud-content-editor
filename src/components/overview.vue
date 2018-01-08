<template>
    <div>
        <app-contentStats></app-contentStats>
        <app-listContent></app-listContent>
    </div>
</template>

<script>
import contentStats from './contentStats.vue';
/* load listContent async */
const listContent = () => import(
    /* webpackChunkName: "listContent" */ './listContent.vue'
);

export default {
  components: {
    'app-contentStats': contentStats,
    'app-listContent': listContent
  },
  name: 'overview',
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
