<template>
    <div>
        <md-input-container id="search-input">
            <label>Suche nach</label>
            <md-autocomplete v-model="queryString" :fetch="loadContent"></md-autocomplete>
        </md-input-container>
        <md-button-toggle md-single id="viewToggle">
          <md-button v-bind:class="{ 'md-accent md-raised':  gutter}" v-on:click="gutter = true">Karten</md-button>
          <md-button v-bind:class="{ 'md-accent md-raised': !gutter}" v-on:click="gutter = false">Liste</md-button>
        </md-button-toggle>
        <md-layout md-gutter v-if="gutter">
            <md-layout class="card-wrapper" v-for="item in data" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="50" md-flex-large="33" md-flex-xlarge="25">
                <app-contentCard v-bind:data="item"></app-contentCard>
            </md-layout>
        </md-layout>
        <table v-else>
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
    </div>
</template>

<script>
import contentCard from './contentCard.vue';
import contentTableRow from './contentTableRow.vue';
import axios from 'axios';

export default {
  components: {
    'app-contentCard': contentCard,
    'app-contentRow': contentTableRow
  },
  name: 'contentList',
  data() {
    return {
      data: [],
      gutter: true,
      queryString: '',
    };
  },
  created() {
    this.loadContent();
  },
  methods: {
    loadContent(){
      const path = (this.queryString == '')?this.$config.API.getPath:(this.$config.API.searchPath + this.queryString );
      axios.get(this.$config.API.baseUrl + this.$config.API.port + path, {headers: {
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
    },
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    .md-layout{
        clear: both;
    }
    .card-wrapper{
        padding: 5px;
        box-sizing: border-box;
    }
    table{
        width: 100%;
    }
    #viewToggle{
        margin-top: 16px;
        float: right;
    }
    #search-input{
        margin-top: 16px;
        float: left;
        max-width: 400px;
    }
</style>
