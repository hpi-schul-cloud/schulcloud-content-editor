<template>
  <div md-gutter class="container-fluid grid">
    <div class="grid-xl-8 grid-s-12">
      <md-card >
        <md-card-header>
          <div class="md-title" v-if="$route.params.id">{{$lang.form.title_edit}}</div>
          <div class="md-title" v-else>{{$lang.form.title_create}}</div>
        </md-card-header>
        <md-card-content>
          <form id="contentForm" @submit.prevent="validateBeforeSubmit">
            <md-field :class="{'md-input-invalid': errors.has('title')}">
              <label>{{$lang.form.title}}</label>
              <md-input v-model="data.title" type="text" v-validate name="title" data-vv-rules="required"></md-input>
              <span class="md-error">{{errors.first('title')}}</span>
            </md-field>

            <md-field :class="{'md-input-invalid': errors.has('description')}">
              <label>{{$lang.form.description}} <span v-tippy :title="$lang.form.description_tooltip"><md-icon>help</md-icon></span></label>
              <md-textarea v-model="data.description" v-validate name="description" data-vv-rules="max:500" maxlength="500"></md-textarea>
              <span class="md-error">{{errors.first('description')}}</span>
            </md-field>

            <md-field :class="{'md-input-invalid': errors.has('url')}">
              <label>{{$lang.form.url}}</label>
              <md-input v-model="data.url" v-validate name="url" data-vv-rules="required|url"></md-input>
              <span class="md-error">{{errors.first('url')}}</span>
            </md-field>

            <md-field :class="{'md-input-invalid': errors.has('thumbnail')}">
              <label>{{$lang.form.thumbnail_url}} <span v-tippy :title="$lang.form.thumbnail_url_tooptip"><md-icon>help</md-icon></span></label>
              <md-input v-model="data.thumbnail" v-validate name="thumbnail" data-vv-rules="url"></md-input>
              <span class="md-error">{{errors.first('thumbnail')}}</span>
            </md-field>

            <md-field>
              <label for="license">{{$lang.form.license}}</label>
              <md-select v-model="data.licenses" id="license" multiple name="license">
                <md-option value="GPL">GPL</md-option>
                <md-option value="MIT">MIT</md-option>
                <md-option value="CC BY-SA">CC BY-SA</md-option>
                <md-option value="CC BY-NC-SA (KA default)">CC BY-NC-SA (KA default)</md-option>
                <md-option value="Standard Youtube">Standard Youtube</md-option>
              </md-select>
            </md-field>

            <md-field>
              <label for="contentCategory">{{$lang.form.categorie}}</label>
              <md-select v-model="data.contentCategory" name="contentCategory" id="contentCategory">
                <md-option value="atomic">Atomic</md-option>
                <md-option value="interactive">Interactive</md-option>
              </md-select>
            </md-field>

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
          <md-button class="md-primary" type="submit" form="contentForm">{{$lang.buttons.save}}</md-button>
        </md-card-actions>
      </md-card>
    </div>
    <div class="grid-xl-4 grid-s-12">
      <div class="preview-wrapper">
        <h2>{{$lang.form.livepreview}}:</h2>
        <app-previewCard v-bind:data="data"></app-previewCard>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);
import VueTippy from 'vue-tippy';
Vue.use(VueTippy);

/* load previewCard async */
const previewCard = () => import(
    /* webpackChunkName: "previewCard" */ './previewCard.vue'
);

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
        this.$http.get( this.$config.API.baseUrl + this.$config.API.port + this.$config.API.getPath + this.$route.params.id ,{headers: {
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
  .gutter > div{
    padding: 5px;
  }
  .md-card{
    width: 100%;
  }
  .preview-wrapper{
    display: block;
    width: 100%;
  }
  textarea{
    min-height: 8rem !important;
  }
  /*.md-has-textarea{
    label{
        top: -6px !important;
        left: 0 !important;
    }
    .md-textarea{
        padding: 0 !important;
    }
  }*/
  .md-icon {
    font-size: 1.5em;
    vertical-align: middle;
  }
</style>
