<template>  
    <md-dialog :md-active.sync="isActive">
      <md-dialog-title>{{$lang.filter.provider.modal_title}}</md-dialog-title>

      <div id="provider-picker">
        <md-field>
          <label for="selectedProviders">{{$lang.filter.provider.placeholder}}</label>
          <md-select v-model="selectedProviders" id="selectedProviders" md-dense> <!-- multiple> -->
            <md-option value="">kein Provider</md-option>
            <md-option value="Khan Academy">Khan Academy</md-option>
            <md-option value="Serlo">Serlo</md-option>
            <md-option value="Youtube">Youtube</md-option>
            <md-option value="LEIFI Physik">LEIFI Physik</md-option>           
          </md-select>
        </md-field>
      </div>

      <md-dialog-actions>
        <md-button @click="onCancle">{{$lang.buttons.cancel}}</md-button>
        <md-button class="md-primary" @click="onConfirm">{{$lang.buttons.add}}</md-button>
      </md-dialog-actions>
    </md-dialog>
</template>

<script>
export default {
  name: 'DialogConfirm',
  props: ['identifier', 'active'],
  data() {
    return {
      isActive: false,
      selectedProviders: '', //[]
      apiQuery: {},
      urlQuery: {},
    };
  },
  created: function(){
    this.$parent.$on('reset', this.resetProviders);
  },
  methods: {
    onConfirm () {
      let displayString;
      
      if (this.selectedProviders.length != 0) {
        // this.apiQuery["providerName[$in]"] = this.selectedProviders; // corret but api seems broken
        this.apiQuery["providerName[$match]"] = this.selectedProviders;
        this.urlQuery = {provider: this.selectedProviders}; //.reduce((prev, curr) => prev +','+ curr )}
        displayString = 'Provider: ' + this.selectedProviders; //.reduce((prev, curr) => prev +', '+ curr );
      }else{
        this.apiQuery = {};
        this.urlQuery = {};
        displayString = null;
      }
      this.$emit('set', this.identifier, {
        apiQuery: this.apiQuery,
        urlQuery: this.urlQuery,
        displayString: displayString,
      });
    },
    onCancle () {
      this.$emit('cancle');
    },
    resetProviders(key){
      if(key == this.identifier){
        this.selectedProviders = '';
      }
    },
  },
  watch:{
    active: function(to, from){
      this.isActive = to;
    },
    isActive: function(to){
      if(to == false){
        this.onCancle();
      }
    }
  },
}
</script>

<style lang="scss" scoped>
#provider-picker{
  padding: 16px;
}
</style>