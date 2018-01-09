<template>
    <table>
        <thead>
            <tr>
              <th>Title</th>
              <th>URL</th>
              <th class="md-hide-small">Lizenz</th>
              <th class="md-hide-medium">Kategorie</th>
            </tr>
        </thead>
        <app-contentRow v-for="item in data" v-bind:data="item"></app-contentRow>
    </table>
</template>

<script>
import contentTableRow from './contentTableRow.vue';
import axios from 'axios';

export default {
  components: {
    'app-contentRow': contentTableRow
  },
  name: 'contentTable',
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
      this.data = response.data.data;
    })
    .catch(e => {
      this.errors.push(e)
    })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
main{
    max-width: 1750px !important;
}
table{
    min-width: 800px;
    width:100%;
    overflow: auto;
    border-collapse: collapse;
    thead{
        text-align: left;
        th{
            padding: 0 8px;
        }
    }
}
</style>
