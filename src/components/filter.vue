<template>
    <div class="filter">
      <md-chip v-for="chip in activeFilter" v-model="activeFilter" :key="chip[0]" v-on:click="visibleProvider = chip[0]" @md-delete="removeFilter(chip[0])" md-clickable md-deletable>{{ chip[1].displayString }}</md-chip>
      
      <md-menu md-direction="bottom-end">
        <md-button md-menu-trigger><md-icon><i class="material-icons">add</i></md-icon> FILTER HINZUFÜGEN</md-button>
        <md-menu-content>
          <md-menu-item v-if="!isApplied('provider')" v-on:click="visibleProvider = 'provider'">Provider</md-menu-item>
          <md-menu-item v-if="!isApplied('createdat')"  v-on:click="visibleProvider = 'createdat'">Erstellt am</md-menu-item>
        </md-menu-content>
      </md-menu>
      
      <provider-filter-dialog @set="setFilter" @cancle="cancle" identifier="provider" v-bind:active="visibleProvider == 'provider'"/>
      <createdat-filter-dialog @set="setFilter" @cancle="cancle" identifier="createdat" v-bind:active="visibleProvider == 'createdat'"/>
  </div>
</template>

<script>
const providerFilterDialog = () => import(
  /* webpackChunkName: "providerFilterDialog" */ './dialogs/filter/provider.vue'
);
const createdAtFilterDialog = () => import(
  /* webpackChunkName: "createdAtFilterDialog" */ './dialogs/filter/date.vue'
);
  
export default {
  components: {
    'provider-filter-dialog': providerFilterDialog,
    'createdat-filter-dialog': createdAtFilterDialog,
  },
  name: 'searchFilter',
  /*props: ['config'],*/
  data() {
    return {
      visibleProvider: "",
      activeFilter: [],
    };
  },
  methods: {
    setFilter(identifier, filterData){
      this.visibleProvider = '';
      // deep copy
      filterData = JSON.parse(JSON.stringify(filterData));
      
      this.removeFilter(identifier);
      this.activeFilter.push([identifier, filterData]);
    },
    removeFilter(key){
      console.log(key);
      //delete this.activeFilter[key];
      this.activeFilter = this.activeFilter.filter(item => { return item[0] != key; })
      // TODO: prevent showing modal again
    },
    cancle(){
      this.visibleProvider = '';
    },
    sendNewQuery(){
      let apiQuery = {}
      console.log(this.activeFilter);
      this.activeFilter.forEach(value => {
        console.log("value:",value);
        Object.assign(apiQuery, value[1].apiQuery);
      }, {} );
      console.log("apiQuery:",apiQuery);
      this.$emit('newFilter', apiQuery);
    },
    isApplied(identifier){
      return this.activeFilter.map(i=>{return i[0];}).includes(identifier);
    }
  },
  watch:{
    activeFilter: function(to, from){
      this.sendNewQuery();
    },
  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
