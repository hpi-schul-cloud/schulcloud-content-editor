<template>
  <md-layout md-gutter class="container-fluid">
    <md-layout md-flex-medium="100" md-flex-large="70" md-flex-xlarge="70">
      <md-card>
        <md-card-header>
          <div class="md-title" v-if="$route.params.id">{{$lang.form.title_edit}}</div>
          <div class="md-title" v-else>{{$lang.form.title_create}}</div>
        </md-card-header>
        <md-card-content>
          <form id="contentForm" @submit.prevent="validateBeforeSubmit">
            <md-input-container :class="{'md-input-invalid': errors.has('title')}">
              <label>{{$lang.form.title}}</label>
              <md-input v-model="data.title" type="text" v-validate name="title" data-vv-rules="required"></md-input>
              <span class="md-error">{{errors.first('title')}}</span>
            </md-input-container>

            <md-input-container :class="{'md-input-invalid': errors.has('description')}">
              <label>{{$lang.form.description}} <span v-tippy title="Geben Sie Geben Sie eine Beschreibung für den Inhalt an."><md-icon>help</md-icon></span></label>
              <md-textarea v-model="data.description" v-validate name="description" data-vv-rules="max:140" maxlength="140"></md-textarea>
              <span class="md-error">{{errors.first('description')}}</span>
            </md-input-container>

            <md-input-container :class="{'md-input-invalid': errors.has('url')}">
              <label>{{$lang.form.url}}</label>
              <md-input v-model="data.url" v-validate name="url" data-vv-rules="required|url"></md-input>
              <span class="md-error">{{errors.first('url')}}</span>
            </md-input-container>

            <md-input-container :class="{'md-input-invalid': errors.has('thumbnail')}">
              <label>{{$lang.form.thumbnail_url}} <span v-tippy title="Geben Sie optional eine URL zu einem Titelbild für den Inhalt an."><md-icon>help</md-icon></span></label>
              <md-input v-model="data.thumbnail" v-validate name="thumbnail" data-vv-rules="url"></md-input>
              <span class="md-error">{{errors.first('thumbnail')}}</span>
            </md-input-container>

            <md-input-container>
              <label for="license">{{$lang.form.license}}</label>
              <md-select v-model="data.licenses" id="license" multiple name="license">
                <md-option value="GPL">GPL</md-option>
                <md-option value="MIT">MIT</md-option>
                <md-option value="CC BY-SA">CC BY-SA</md-option>
                <md-option value="CC BY-NC-SA (KA default)">CC BY-NC-SA (KA default)</md-option>
                <md-option value="Standard Youtube">Standard Youtube</md-option>
              </md-select>
            </md-input-container>

            <md-input-container>
              <label for="contentCategory">{{$lang.form.categorie}}</label>
              <md-select v-model="data.contentCategory" name="contentCategory" id="contentCategory">
                <md-option value="atomic">Atomic</md-option>
                <md-option value="interactive">Interactive</md-option>
              </md-select>
            </md-input-container>

            <section>
                <md-chips id="tags" v-model="data.tags" :md-max="10" :md-input-placeholder="($lang.form.tags)+'... ('+($lang.form.max)+' 10)'">
                  <template slot-scope="tag" slot="tag">
                    <span>{{ tag.value }}</span>
                  </template>
                </md-chips>
            </section>
          </form>
        </md-card-content>
        <md-card-actions>
          <md-button style="position:absolute; left:8px;">{{$lang.buttons.delete}}</md-button>
          <md-button v-on:click="$router.go(-1)" style="color: initial;">{{$lang.buttons.cancel}}</md-button>
          <md-button class="md-accent" type="submit" form="contentForm">{{$lang.buttons.save}}</md-button>
        </md-card-actions>
      </md-card>
    </md-layout>
    <md-layout>
      <div class="preview-wrapper">
        <h2>{{$lang.form.livepreview}}:</h2>
        <app-previewCard v-bind:data="data"></app-previewCard>
      </div>
    </md-layout>
  </md-layout>
</template>

<script>
import Vue from 'vue';
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

/* load previewCard async */
const previewCard = () => import(
    /* webpackChunkName: "previewCard" */ './previewCard.vue'
);

import axios from 'axios';
export default {
  components: {
    'app-previewCard': previewCard
  },
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
  methods: {
    loadContent() {
      if(this.$route.params.id){
        axios.get( this.$config.API.baseUrl + this.$config.API.port + this.$config.API.getPath + this.$route.params.id ,{headers: {
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
        this.data = {};
      }
    },
    validateBeforeSubmit() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.submitContent();
          return;
        }
      });
    },
    submitContent: function (event) {
        const d = this.data;
        const newData = {
                "providerName": d.providerName,
                "url": d.url,
                "title": d.title,
                "description": d.description,
                "thumbnail": d.thumbnail,
                "contentCategory": d.contentCategory,
                "licenses": d.licenses,
                "tags": d.tags
            };
        if(this.$route.params.id){
            axios.patch( this.$config.API.baseUrl + this.$config.API.pushPort + this.$config.API.pushContentPath + this.$route.params.id, newData, {
                headers: {"Authorization" : "Bearer " + localStorage.getItem('jwt')},
            });
        }else{
            axios.post( this.$config.API.baseUrl + this.$config.API.pushPort + this.$config.API.pushContentPath, newData, {
                headers: {"Authorization" : "Bearer " + localStorage.getItem('jwt')},
            });
        }
    }
  },
  created() {
      this.loadContent();
  },
  watch:{
    '$route' (to, from){
      this.loadContent();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .md-layout > .md-layout{
    padding: 5px;
  }
  .md-card{
    width: 100%;
  }
  .preview-wrapper{
    display: block;
    width: 100%;
  }
  .md-has-textarea{
    label{
        top: -6px !important;
        left: 0 !important;
    }
    .md-textarea{
        padding: 0 !important;
    }
  }
  .md-icon {
    height: 16px !important;
    width: 16px !important;
    min-height: 16px !important;
    min-width: 16px !important;
  }
</style>
