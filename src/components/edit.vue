<template>
  <md-card>
    <md-card-header>
      <div class="md-title" v-if="$route.params.id">Inhalt bearbeiten</div>
      <div class="md-title" v-else>Inhalt erstellen</div>
    </md-card-header>
    <md-card-content>
      <form id="contentForm" @submit.prevent="validateBeforeSubmit">
        <md-input-container :class="{'md-input-invalid': errors.has('title')}">
          <label>Titel</label>
          <md-input v-model="data.title" type="text" v-validate name="title" data-vv-rules="required"></md-input>
          <span class="md-error">{{errors.first('title')}}</span>
        </md-input-container>

        <md-input-container :class="{'md-input-invalid': errors.has('description')}">
          <label>Beschreibung</label>
          <md-textarea v-model="data.description" v-validate name="description" data-vv-rules="max:140" maxlength="140"></md-textarea>
          <span class="md-error">{{errors.first('description')}}</span>
        </md-input-container>

        <md-input-container :class="{'md-input-invalid': errors.has('url')}">
          <label>URL</label>
          <md-input v-model="data.url" v-validate name="url" data-vv-rules="required|url"></md-input>
          <span class="md-error">{{errors.first('url')}}</span>
        </md-input-container>

        <md-input-container :class="{'md-input-invalid': errors.has('thumbnail')}">
          <label>Thumbnail-URL</label>
          <md-input v-model="data.thumbnail" v-validate name="thumbnail" data-vv-rules="url"></md-input>
          <span class="md-error">{{errors.first('thumbnail')}}</span>
        </md-input-container>
        <div v-if="data.thumbnail" >
            <img :src="data.thumbnail">
        </div>

        <md-input-container>
          <label for="license">Lizenz</label>
          <md-select v-model="data.licenses" id="license" multiple name="license">
            <md-option value="GPL">GPL</md-option>
            <md-option value="MIT">MIT</md-option>
            <md-option value="CC BY-SA">CC BY-SA</md-option>
          </md-select>
        </md-input-container>

        <md-input-container>
          <label for="contentCategory">Kategorie</label>
          <md-select v-model="data.contentCategory" name="contentCategory" id="contentCategory">
            <md-option value="atomic">Atomic</md-option>
            <md-option value="interactive">Interactive</md-option>
          </md-select>
        </md-input-container>

        <section>
            <md-chips id="tags" v-model="data.tags" :md-max="10" md-input-placeholder="Tags... (max. 10)">
              <template slot-scope="tag" slot="tag">
                <span>{{ tag.value }}</span>
              </template>
            </md-chips>
        </section>
      </form>
    </md-card-content>
    <md-card-actions>
      <md-button style="position:absolute; left:8px;">Delete</md-button>
      <router-link to="/list"><md-button style="color: initial;">Cancel</md-button></router-link>
      <md-button class="md-accent" type="submit" form="contentForm">Save</md-button>
    </md-card-actions>
  </md-card>
</template>

<script>
import Vue from 'vue';
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

import axios from 'axios';
export default {
  name: 'contentForm',
  data() {
    return {
      data: {
            "providerName": "",
            "url": "",
            "title": "",
            "description": "",
            "thumbnail": "",
            "contentCategory": "",
            "licenses": [],
            "tags": []
      },
    };
  },
  beforeCreate() {
      this.loadContent();
  },
  watch:{
    '$route' (to, from){
      this.loadContent();
    }
  },
  methods: {
    loadContent(){
      if(this.$route.params.id){
        axios.get('https://schul-cloud.org:8080/content/resources/'+ this.$route.params.id ,{headers: {
            "Authorization" : "Bearer " + localStorage.getItem('jwt')
          }
        })
        .then(response => {
          // JSON responses are automatically parsed.
          this.data = response.data;
        })
        .catch(e => {
          this.errors.push(e)
        })
      }else{
        this.data = [];
      }
    },
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
            axios.patch("https://schul-cloud.org:8080/content/resources/59919169c9df580090bc0815", this.data);
        }else{
            axios.post("https://schul-cloud.org:8080/content/resources/", this.data);
        }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.md-has-textarea{
    label{
        top: -6px !important;
        left: 0 !important;
    }
    .md-textarea{
        padding: 0 !important;
    }
}
</style>
