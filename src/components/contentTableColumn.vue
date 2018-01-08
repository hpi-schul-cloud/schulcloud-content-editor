<template>
    <tr>
          <form id="contentForm" @submit.prevent="validateBeforeSubmit">
            <td><input v-model="data.title" type="text" v-validate name="title" data-vv-rules="required"></input></td>
            <td><input v-model="data.url" v-validate name="url" data-vv-rules="required|url"></input></td>
            <td>
              <select v-model="data.licenses" id="license" multiple name="license">
                <option value="GPL">GPL</option>
                <option value="MIT">MIT</option>
                <option value="CC BY-SA">CC BY-SA</option>
              </select>
            </td>
            <td>
              <select v-model="data.contentCategory" name="contentCategory" id="contentCategory">
                <option value="atomic">Atomic</option>
                <option value="interactive">Interactive</option>
              </select>
            </td>
          </form>
          <button>Delete</button>
          <button class="md-accent" type="submit" form="contentForm">Save</button>
    </tr>
</template>

<script>
import Vue from 'vue';
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

import axios from 'axios';
export default {
  name: 'contentTableColumn',
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
            axios.patch(" https://schul-cloud.org:4040/content/resources/"+this.data._id, this.data, {
                headers: {"Authorization" : "Bearer " + localStorage.getItem('jwt')},
            });
        }else{
            axios.post(" https://schul-cloud.org:4040/content/resources/"+this.data._id, this.data, {
                headers: {"Authorization" : "Bearer " + localStorage.getItem('jwt')},
            });
        }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>