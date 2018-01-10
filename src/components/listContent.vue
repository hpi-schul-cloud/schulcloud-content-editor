<template>
    <md-layout md-gutter>
        <md-layout class="card-wrapper" v-for="item in data" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="50" md-flex-large="33" md-flex-xlarge="33">
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
    axios.get(this.$config.API.baseUrl + this.$config.API.port + this.$config.API.getPath, {headers: {
        "Authorization" : "Bearer " + localStorage.getItem('jwt')
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
    .card-wrapper{
        padding: 5px;
        box-sizing: border-box;
    }
</style>
