<template>
    <md-layout md-gutter>
        <md-layout v-for="item in data" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="50" md-flex-large="33" md-flex-xlarge="33">
            <app-contentCard v-bind:data="item"></app-contentCard>
        </md-layout>
    </md-layout>
</template>

<script>
import contentCard from './contentCard.vue';
import axios from 'axios';

export default {
  components: {
    'app-contentCard': contentCard
  },
  name: 'contentList',
  data() {
    return {
      data: [],
    };
  },
  created() {
    axios.get(`https://schul-cloud.org:8080/content/resources/`,{headers: {
        "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJhY2NvdW50SWQiOiIwMDAwZDIzMTgxNmFiYmE1ODQ3MTRjOWYiLCJ1c2VySWQiOiIwMDAwZDIzMTgxNmFiYmE1ODQ3MTRjOWUiLCJpYXQiOjE1MTA3MzUwNjIsImV4cCI6MTUxMzMyNzA2MiwiYXVkIjoiaHR0cHM6Ly9zY2h1bC1jbG91ZC5vcmciLCJpc3MiOiJmZWF0aGVycyIsInN1YiI6ImFub255bW91cyJ9.OKdBL4TJVc9weiF7l-tv6fT7oFrFiCvAOyqey141NPM"
      }
    })
    .then(response => {
      // JSON responses are automatically parsed.
      this.data = response.data.data;
    })
    .catch(e => {
      this.errors.push(e)
    })
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
