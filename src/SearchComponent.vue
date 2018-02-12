<template>
    <app-searchContent v-bind:readOnly="true"></app-searchContent>
</template>

<script>

import searchContent from './components/pages/overview/search.vue';

export default {
  components: {
    'app-searchContent': searchContent,
  },
  name: 'searchComponent',
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
@import "./default";

.container-fluid{
  width: 100%;
  max-width: 900px;
  margin: 0 auto 0;
}
.container-fluid-max{
  width: 100%;
  max-width: 1750px;
  margin: 0 auto 0;
}


.grid{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 5px;
}

@for $i from 1 through 12{
    .hide-xl{
        display: none;
    }
  .grid-xl-#{$i}{
    grid-column: span $i;
  }
}

@media (max-width: 1903px){
    .hide-l{
        display: none;
    }
    @for $i from 1 through 12{
      .grid-l-#{$i}{
        grid-column: span $i;
      }
    }
}
@media (max-width: 1264px){
    .hide-m{
        display: none;
    }
    @for $i from 1 through 12{
      .grid-m-#{$i}{
        grid-column: span $i;
      }
    }
}
@media (max-width: 944px){
    .hide-s{
        display: none;
    }
    @for $i from 1 through 12{
      .grid-s-#{$i}{
        grid-column: span $i;
      }
    }
}
@media (max-width: 600px){
    .hide-s{
        display: none;
    }
    @for $i from 1 through 12{
      .grid-xs-#{$i}{
        grid-column: span $i;
      }
    }
}

@for $i from 0 through 10{
  .height-#{$i*10}{
    height: percentage($i/10);
  }
}

#app {
  padding: 90px 0 15px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

main {
  margin: 0 auto !important;
  padding: 0 15px;
}
</style>
