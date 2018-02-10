<template>
    <div class="filter">
      <md-chip v-for="chip in activeFilter" v-model="activeFilter" :key="chip[0]" v-on:click="visibleProvider = chip[0]" @md-delete.stop="removeFilter(chip[0], true)" md-clickable md-deletable>{{ chip[1].displayString }}</md-chip>
      
      <md-menu md-direction="bottom-end">
        <md-button md-menu-trigger><md-icon><i class="material-icons">add</i></md-icon> FILTER HINZUFÜGEN</md-button>
        <md-menu-content>
          <md-menu-item v-if="!isApplied('provider')"  v-on:click="visibleProvider = 'provider'">Provider</md-menu-item>
          <md-menu-item v-if="!isApplied('createdat')" v-on:click="visibleProvider = 'createdat'">Erstellt am</md-menu-item>
        </md-menu-content>
      </md-menu>
      
      <provider-filter-dialog  @set="setFilter" @cancle="cancle" identifier="provider"  v-bind:active="visibleProvider == 'provider'" />
      <createdat-filter-dialog @set="setFilter" @cancle="cancle" identifier="createdat" v-bind:active="visibleProvider == 'createdat'"/>
  </div>
</template>

<script>
const providerFilterDialog = () => import(
  /* webpackChunkName: "providerFilterDialog" */ '@/components/dialogs/filter/provider.vue'
);
const createdAtFilterDialog = () => import(
  /* webpackChunkName: "createdAtFilterDialog" */ '@/components/dialogs/filter/date.vue'
);
  
export default {
  components: {
    'provider-filter-dialog': providerFilterDialog,
    'createdat-filter-dialog': createdAtFilterDialog,
  },
  name: 'searchFilter',
  data() {
    return {
      visibleProvider: "",
      activeFilter: [],
    };
  },
  methods: {
    setFilter(identifier, filterData){
      this.visibleProvider = '';

      filterData = JSON.parse(JSON.stringify(filterData)); // deep copy

      this.removeFilter(identifier, false);
      this.activeFilter.push([identifier, filterData]);
    },
    removeFilter(key, emit){
      this.activeFilter = this.activeFilter.filter(item => { return item[0] != key; })
      if(emit){
        this.$emit('reset', key);
      }
    },
    cancle(){
      this.visibleProvider = '';
    },
    sendNewQuery(){
      let apiQuery = {}
      let urlQuery = {}
      this.activeFilter.forEach(value => {
        Object.assign(apiQuery, value[1].apiQuery);
        Object.assign(urlQuery, value[1].urlQuery);
      }, {} );
      this.$emit('newFilter', apiQuery, urlQuery);
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
