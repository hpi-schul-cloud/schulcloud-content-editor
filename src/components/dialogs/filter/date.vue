<template>  
    <md-dialog :md-active.sync="isActive">
      <md-dialog-title>Erstellt am</md-dialog-title>

      <div id="provider-picker">
        <md-datepicker v-model="createdDateRange.from">
          <label>From</label>
        </md-datepicker>
        
        <md-datepicker v-model="createdDateRange.to">
          <label>To</label>
        </md-datepicker>
      </div>

      <md-dialog-actions>
        <md-button @click="onCancle">CANCLE</md-button>
        <md-button class="md-primary" @click="onConfirm">APPLY</md-button>
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
      createdDateRange: {
        from: "",
        to: "",
      },
      apiQuery: {},
      urlQuery: {},
    };
  },
  methods: {
    onConfirm () {
      let displayString;
      let fromString;
      let toString;
      
      if(this.createdDateRange.from || this.createdDateRange.to){
        if(this.createdDateRange.from){
          let from = new Date(this.createdDateRange.from);
          this.apiQuery['createdAt[$gte]'] = this.createdDateRange.from; // startDate
          this.urlQuery['createdAtFrom'] = this.createdDateRange.from;
          fromString = from.getDate()+'.'+(from.getMonth()+1)+'.'+from.getFullYear();
        }else{
          delete this.apiQuery['createdAt[$gte]'];
          delete this.urlQuery['createdAtFrom'];
        }
        if(this.createdDateRange.from){
          let to = new Date(this.createdDateRange.to);
          this.apiQuery['createdAt[$lte]'] = this.createdDateRange.to; // endDate
          this.urlQuery['createdAtTo'] = this.createdDateRange.to;
          toString = to.getDate()+'.'+(to.getMonth()+1)+'.'+to.getFullYear();
        }else{
          delete this.apiQuery['createdAt[$gte]'];
          delete this.urlQuery['createdAtTo'];
        }
        
        displayString = (fromString || '~') + " - " + (toString || '~');
      }else{
        this.apiQuery = {}
        displayString = null,
        this.urlQuery = {}
      }
      this.$emit('set', this.identifier, {
        apiQuery: this.apiQuery,
        urlQuery: this.urlQuery,
        displayString: displayString,
      });
    },
    onCancle () {
      this.$emit('cancle');
    }
  },
  watch:{
    active: function(to, from){
      this.isActive = to;
    },
  },
  computed: {
      firstDayOfAWeek: {
        get () {
          return 1
        }
      }
    }
}
</script>

<style lang="scss" scoped>
#provider-picker{
  padding: 16px;
}
</style>