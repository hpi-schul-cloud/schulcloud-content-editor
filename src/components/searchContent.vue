<template>
    <div>
        <md-input-container id="search-input">
            <label>Suche nach</label>
            <md-input v-model="searchQuery"></md-input>
        </md-input-container>
        <b id="resultHeadline" v-if="searchQuery">{{this.pagination.totalEntrys}} Suchergebnisse für "{{this.searchQuery}}"</b>
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
        <div id="placeholder" v-if="data.length == 0">
            <md-icon class="md-size-3x md-accent">error_outline</md-icon>
            <p>keine Ergebnisse gefunden</p>
        </div>
        <app-pagination @pageChanged="pageChanged" v-bind:config="pagination"></app-pagination>
    </div>
</template>

<script>
import contentCard from './contentCard.vue';
import pagination from './paginationTemplate.vue';
/* load contentTableRow async */
const contentTableRow = () => import(
    /* webpackChunkName: "contentTableRow" */ './contentTableRow.vue'
);
const qs = require('query-string');

export default {
  components: {
    'app-contentCard': contentCard,
    'app-contentRow': contentTableRow,
    'app-pagination': pagination,
  },
  name: 'contentList',
  data() {
    return {
      data: [],
      gutter: true,
      searchQuery: '',
      pagination: {
          page: 1,
          itemsPerPage: 12,
          totalEntrys: 0,
          buttonRange: 2,
          scroll: {
            top: 0, 
            left: 0, 
            behavior: 'smooth' 
          }
      }
    };
  },
  created() {
    if(this.$route.query.q){
        this.searchQuery = this.$route.query.q;
    }
    if(this.$route.query.p){
        this.pagination.page = parseInt(this.$route.query.p);
    }
    this.loadContent();
    
  },
  methods: {
    pageChanged(page){
        this.pagination.page = page;
        this.loadContent();
    },
    loadContent(){
      // pagination for request
      const page = this.pagination.page || 1;
      let paginationQuery = qs.stringify({$limit: this.pagination.itemsPerPage, $skip: this.pagination.itemsPerPage * (page - 1)});

      // query for search request
      const searchString = this.searchQuery || "";
      const searchItem = "_all"
      let searchQuery =  searchItem + "[$match]="+searchString;

      // set unique url
      this.$router.push({ query: { ...this.$route.query, q: searchString }});
      this.$router.push({ query: { ...this.$route.query, p: page }});
      // build request path and fetch new data
      const path = (searchString.length == 0)?this.$config.API.getPath:(this.$config.API.searchPath + "?" + paginationQuery + "&" + searchQuery );
      this.$http.get(this.$config.API.baseUrl + this.$config.API.port + path, {headers: {
          "Authorization" : "Bearer " + localStorage.getItem('jwt')
        }
      })
      .then(response => {
        this.data = response.data.data;
        this.pagination.totalEntrys = response.data.total;
        
      })
      .catch(e => {
        console.error(e);
      })
    },
  },
  watch:{
    '$route' (to, from){
        /* handle url changes */
        this.searchQuery = this.$route.query.q;
        this.pagination.page = parseInt(this.$route.query.p);
    },
    searchQuery: function(to, from){
        this.pagination.page = 1;
        this.loadContent();
    },
    'pagination.page': function(to, from){
        this.loadContent();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    .md-layout{
        clear: both;
    }
    #resultHeadline{
        display: block;
        clear: left;
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
        font-size: 2em !important;
        margin-top: 16px;
        float: left;
        max-width: 400px;
    }
    #placeholder{
        display: block;
        text-align: center;
        font-size: 2rem;
        margin: 5rem auto;
    }
</style>
