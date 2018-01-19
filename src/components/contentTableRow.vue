<template>
  <form id="contentForm" @submit.prevent="validateBeforeSubmit">
    <td>
        <md-input-container :class="{'md-input-invalid': errors.has('title')}">
          <md-input v-model="data.title" type="text" v-validate name="title" data-vv-rules="required"></md-input>
          <span class="md-error">{{errors.first('title')}}</span>
        </md-input-container>
    </td>
    <td>
        <md-input-container :class="{'md-input-invalid': errors.has('url')}">
          <md-input v-model="data.url" v-validate name="url" data-vv-rules="required|url"></md-input>
          <span class="md-error">{{errors.first('url')}}</span>
        </md-input-container>
    </td>
    <td class="md-hide-small">
        <md-input-container>
          <md-select v-model="data.licenses" id="license" multiple name="license">
            <md-option value="GPL">GPL</md-option>
            <md-option value="MIT">MIT</md-option>
            <md-option value="CC BY-SA">CC BY-SA</md-option>
            <md-option value="CC BY-NC-SA (KA default)">CC BY-NC-SA (KA default)</md-option>
            <md-option value="Standard Youtube">Standard Youtube</md-option>
          </md-select>
        </md-input-container>
    </td>
    <td class="md-hide-medium">
        <md-input-container>
          <md-select v-model="data.contentCategory" name="contentCategory" id="contentCategory">
            <md-option value="atomic">Atomic</md-option>
            <md-option value="interactive">Interactive</md-option>
          </md-select>
        </md-input-container>
    </td>
    <td>
        <md-button class="md-icon-button" type="delete"><md-icon>delete</md-icon></md-button>
        <md-button class="md-icon-button md-accent" type="submit"><md-icon>save</md-icon></md-button>
    </td>
  </form>
</template>

<script>
import Vue from 'vue';
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

export default {
  name: 'contentTableRow',
  props: ['data'],
  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          alert('Form Submitted!');
          this.submitContent();
          return;
        }
        alert('Correct the errors!');
      });
    },
    submitContent: function (event) {
        if(this.$route.params.id){
            this.$http.patch(this.$config.API.baseUrl + this.$config.API.pushPort + this.$config.API.pushContentPath + this.data._id, this.data, {
                headers: {"Authorization" : "Bearer " + localStorage.getItem('jwt')},
            });
        }else{
            this.$http.post(this.$config.API.baseUrl + this.$config.API.pushPort + this.$config.API.pushContentPath, this.data, {
                headers: {"Authorization" : "Bearer " + localStorage.getItem('jwt')},
            });
        }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
form{
    display:table-row;
    td{
        vertical-align:top;
        padding: 0 8px;
        .md-input-container{
            margin-top: 0;
            padding-top: 0;
            min-height: initial;
        }
        &:last-of-type{
            width: 80px;
            white-space: nowrap;
        }
        .md-button{
            margin: 0;
        }
    }
}
</style>