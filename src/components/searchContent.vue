<template>
    <div>
        <!--<md-field id="search-input">
            <label>{{$lang.searchContent.search_for}}</label>
            <md-input v-model="searchQuery"></md-input>
        </md-field>-->
        <div id="search-input">
            <input id="search-query-input" v-model.lazy="searchQuery" :placeholder="$lang.searchContent.search_for + '...'" /></br>
            <span id="resultHeadline" v-if="searchQuery"><b>{{this.pagination.totalEntrys}}</b> {{$lang.searchContent.searchResults_for}} <b>"{{this.searchQuery}}"</b></span>
        </div>
        <div v-if="readOnly != true" id="viewToggle">
          <md-button class="md-toggle" v-bind:class="{ 'md-primary md-raised':  gutter}" v-on:click="gutter = true">{{$lang.buttons.card}}</md-button>
          <md-button class="md-toggle" v-bind:class="{ 'md-primary md-raised': !gutter}" v-on:click="gutter = false">{{$lang.buttons.list}}</md-button>
        </div>
        <div md-gutter v-if="gutter" class="grid">
            <div class="card-wrapper grid-xs-12 grid-s-6 grid-m-6 grid-l-4 grid-xl-3 height-100" v-for="item in data">
                <app-contentCard v-bind:data="item" v-bind:readOnly="readOnly" class="height-100"></app-contentCard>
            </div>
        </div>
        <table v-else-if="readOnly != true">
            <thead>
                <tr>
                  <th>{{$lang.form.title}}</th>
                  <th>{{$lang.form.url}}</th>
                  <th class="hide-s">{{$lang.form.license}}</th>
                  <th class="hide-m">{{$lang.form.categorie}}</th>
                </tr>
            </thead>
            <app-contentRow v-for="item in data" v-bind:data="item"></app-contentRow>
        </table>
        <md-empty-state v-if="data.length == 0" class="md-primary"
          md-icon="error_outline"
          :md-label="$lang.searchContent.nothing_found"
          :md-description="$lang.searchContent.nothing_found_help">
        </md-empty-state>
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
  props: ['readOnly'],
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
    let query = qs.parse(location.search);
    if(query.q){
        this.searchQuery = query.q;
    }
    if(query.p){
        this.pagination.page = parseInt(query.p);
    }
    this.loadContent();
    window.onhashchange = this.urlChangeHandler;
  },
  methods: {
    pageChanged(page){
        this.pagination.page = page;
        this.loadContent();
    },
    updateURL(newQuery) {
      if (history.pushState) {
          var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + qs.stringify(newQuery);
          window.history.pushState({path:newurl},'',newurl);
      }
    },
    loadContent(){
      // clear data to show "loading state"
      this.data = [];
      
      // pagination for request
      const page = this.pagination.page || 1;
      let paginationQuery = qs.stringify({$limit: this.pagination.itemsPerPage, $skip: this.pagination.itemsPerPage * (page - 1)});

      // query for search request
      const searchString = this.searchQuery || "";
      const searchItem = "_all"
      let searchQuery =  searchItem + "[$match]="+searchString;

      // set unique url
      let query = qs.parse(location.search);
      query.q = searchString;
      query.p = page;
      this.updateURL(query);
      //location.search = ;
      //this.$router.push({ query: { ...this.$route.query, q: searchString }});
      //this.$router.push({ query: { ...this.$route.query, p: page }});
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
    urlChangeHandler(){
        // handle url changes
        let query = qs.parse(location.search);
        if(this.searchQuery != query.q){
            this.searchQuery = query.q;
        }
        if(this.pagination.page != parseInt(query.p)){
            this.pagination.page = parseInt(query.p);
        }
    }
  },
  watch:{
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
    .grid{
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
        .md-button{
            margin: 0;
        }
    }
    #search-input{
        font-size: 1.25em !important;
        margin-top: 16px;
        float: left;
        width: calc(100% - 200px);
        #search-query-input{
            display: inline-block;
            font-size: 1em;
            line-height: 1em;
            width: 100%;
            max-width: 500px;
            padding: 0;
            margin: 0;
            outline: none;
            background: transparent;
            border: none;
            color: inherit;
            border-bottom: 1px solid grey;
            &:focus{
                color: var(--md-theme-default-primary);
                border-bottom: 1px solid var(--md-theme-default-primary);
            }
        }
        #resultHeadline{
            font-size: 1rem;
            display: block;
        }
    }
</style>
