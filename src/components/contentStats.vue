<template>
  <md-card class="card-content">
    <md-card-header>
      <h2 class="md-title">{{$lang.stats.title}}</h2>
    </md-card-header>

    <md-card-content>
      <div><b>{{$lang.stats.article}}:</b> {{data.total}}</div>
    </md-card-content>
  </md-card>
</template>

<script>
export default {
  name: 'contentStats',
  data() {
    return {
      data: [],
    };
  },
  created() {
    this.$http.get( this.$config.API.baseUrl + this.$config.API.port + this.$config.API.getPath,{headers: {
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
