<template>
  <div>
    <!--<md-field id="search-input">
        <label>{{$lang.searchContent.search_for}}</label>
        <md-input v-model="searchQuery"></md-input>
    </md-field>-->
    <div id="search-input">
      <input id="search-query-input" v-model.lazy="searchQuery"
             :placeholder="$lang.searchContent.search_for + '...'"/></br>
      <span id="resultHeadline"
            v-if="searchQuery"><b>{{this.pagination.totalEntrys}}</b> {{$lang.searchContent.searchResults_for}} <b>"{{this.searchQuery}}"</b></span>
    </div>

    <div class="md-layout">
      <div class="md-layout-item">
        <v-select placeholder="Provider" v-model="selectedProviders" multiple :on-change="loadContent"
        :options="['Khan Academy', 'Anderer Provider']"></v-select>
      </div>

      <div class="md-layout-item date-picker">
        <date-range-picker
          start-date="01/07/2017"
          :end-date="today()"
          format="DD/MM/YYYY"
          @get-dates="setCreatedDateRange">
        </date-range-picker>
        <span class="clear-date-picker" v-on:click="clearDatePicker">
                <md-icon>delete</md-icon></span>
      </div>
    </div>

    <div v-if="readOnly != true" id="viewToggle">
      <md-button class="md-toggle" v-bind:class="{ 'md-primary md-raised':  gutter}" v-on:click="gutter = true">
        {{$lang.buttons.card}}
      </md-button>
      <md-button class="md-toggle" v-bind:class="{ 'md-primary md-raised': !gutter}" v-on:click="gutter = false">
        {{$lang.buttons.list}}
      </md-button>
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
  import dateRangePicker from 'vue-daterange-picker';
  import vueSelect from 'vue-select';
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
      'date-range-picker': dateRangePicker,
      'v-select': vueSelect
    },
    name: 'contentList',
    props: ['readOnly'],
    data() {
      return {
        data: [],
        createdDateRange: {start: undefined, end: undefined},
        selectedProviders: [],
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
      if (query.q) {
        this.searchQuery = query.q;
      }
      if (query.p) {
        this.pagination.page = parseInt(query.p);
      }
      this.loadContent();
      window.onhashchange = this.urlChangeHandler;
    },
    methods: {
      pageChanged(page) {
        this.pagination.page = page;
        this.loadContent();
      },
      updateURL(newQuery) {
        if (history.pushState) {
          var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + qs.stringify(newQuery);
          window.history.pushState({path: newurl}, '', newurl);
        }
      },
      loadContent() {
        // clear data to show "loading state"
        this.data = [];

        // pagination for request
        const page = this.pagination.page || 1;

        // query for search request
        const searchString = this.searchQuery || "";

        // set unique url
        let query = qs.parse(location.search);
        query.q = searchString;
        query.p = page;
        this.updateURL(query);

        // build request path and fetch new data
        let searchQuery = {
          $limit: this.pagination.itemsPerPage,
          $skip: this.pagination.itemsPerPage * (page - 1),
          "_all[$match]": searchString,
        };

        // TODO redo
        const path = (searchString.length == 0) ? this.$config.API.getPath + "?" + qs.stringify(this.getFilterQuery())
          : (this.$config.API.searchPath + "?" + qs.stringify(searchQuery));
        this.$http.get(this.$config.API.baseUrl + this.$config.API.port + path, {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem('jwt')
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
      urlChangeHandler() {
        // handle url changes
        let query = qs.parse(location.search);
        if (this.searchQuery != query.q) {
          this.searchQuery = query.q;
        }
        if (this.pagination.page != parseInt(query.p)) {
          this.pagination.page = parseInt(query.p);
        }
      },
      getFilterQuery() {
        let filterQuery = {};

        if (this.createdDateRange.start && this.createdDateRange.end) {
          let startDate = new Date(this.createdDateRange.start);
          let endDate = new Date(this.createdDateRange.end);

          filterQuery["createdAt[$gte]"] = startDate.getTime();
          filterQuery["createdAt[$lte]"] = endDate.getTime();
        }

        if (this.selectedProviders.length != 0) {
          filterQuery["providerName[$in]"] = this.selectedProviders;
        }

        return filterQuery;
      },
      setCreatedDateRange(range) {
        this.createdDateRange.start = range.startDate;
        this.createdDateRange.end = range.endDate;
        this.loadContent();
        console.log(this.createdDateRange);
      },
      today() {
        let date = new Date();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();

        return day + "/" + month + "/" + year;
      },
      clearDatePicker() {
        this.createdDateRange.start = null;
        this.createdDateRange.end = null;

        this.$el.querySelector('.start-date').value = '-';
        this.$el.querySelector('.end-date').value = '-';
      }
    },
    watch: {
      searchQuery: function (to, from) {
        if (from != "" && to != from) {
          this.pagination.page = 1;
          this.loadContent();
        }
      },
      'pagination.page': function (to, from) {
        if (from != "" && to != from) {
          this.loadContent();
        }
      }
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .date-picker{
    display: inline-flex;
  }

  .clear-date-picker{
    margin-top: 7px;
  }

  .md-layout {
    width: 100%;
    margin-bottom: 5px;
  }

  .md-layout-item {
    margin-right: 5px;
  }

  .grid {
    clear: both;
  }

  .card-wrapper {
    padding: 5px;
    box-sizing: border-box;
  }

  table {
    width: 100%;
  }

  #viewToggle {
    margin-top: 16px;
    float: right;
    .md-button {
      margin: 0;
    }
  }

  #search-input {
    font-size: 1.75em !important;
    margin-top: 16px;
    float: left;
    width: calc(100% - 200px);
    margin-bottom: 16px;
    #search-query-input {
      display: inline-block;
      font-size: 1em;
      line-height: 1em;
      width: 100%;
      max-width: 500px;
      padding: 0;
      margin: 0;
      margin-left: 5px;
      outline: none;
      background: transparent;
      border: none;
      color: inherit;
      border-bottom: 1px solid grey;
      &:focus {
        color: var(--md-theme-default-primary);
        border-bottom: 1px solid var(--md-theme-default-primary);
      }
    }
    #resultHeadline {
      font-size: 1rem;
      display: block;
    }
  }
</style>
