<template>
  <md-card class="card-content">
    <md-card-header>
      <h2 class="md-title">Statistik</h2>
    </md-card-header>

    <md-card-content>
      <div><b>Artikel:</b> {{data.total}}</div>
    </md-card-content>
  </md-card>
</template>

<script>
import axios from 'axios';

export default {
  name: 'contentStats',
  data() {
    return {
      data: [],
    };
  },
  created() {
    axios.get(`https://schul-cloud.org:8080/content/resources/`,{headers: {
        "Authorization" : "Bearer " + localStorage.getItem('jwt')
      }
    })
    .then(response => {
      // JSON responses are automatically parsed.
      this.data = response.data;
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
