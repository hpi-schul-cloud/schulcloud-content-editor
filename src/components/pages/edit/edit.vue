<template>
  <div class="wrapper">
    <div md-gutter class="container-fluid grid">
      <div class="grid-xl-8 grid-s-12">
        <md-card>
          <md-card-header>
            <div class="md-title" v-if="$route.params.id">{{$lang.edit.title_edit}}</div>
            <div class="md-title" v-else>{{$lang.edit.title_create}}</div>
          </md-card-header>
          <md-card-content>
            <form id="contentForm" @submit.prevent="validateBeforeSubmit">
              <md-field :class="{'md-input-invalid': errors.has('title')}">
                <label>{{$lang.edit.form.title}}</label>
                <md-input v-model="data.title" type="text" v-validate name="title" data-vv-rules="required"></md-input>
                <span class="md-error">{{errors.first('title')}}</span>
              </md-field>

              <md-field :class="{'md-input-invalid': errors.has('description')}">
                <label>
                  {{$lang.edit.form.description}}
                  <span>
                    <md-icon>help</md-icon>
                    <md-tooltip md-direction="right">{{$lang.edit.form.description_tooltip}}</md-tooltip>
                  </span>
                </label>
                <md-textarea v-model="data.description" v-validate name="description" data-vv-rules="max:500"
                            maxlength="500"></md-textarea>
                <span class="md-error">{{errors.first('description')}}</span>
              </md-field>

              <md-field :class="{'md-input-invalid': errors.has('url')}">
                <label>{{$lang.edit.form.url}}</label>
                <md-input v-model="data.url" v-validate name="url" data-vv-rules="required|url"></md-input>
                <span class="md-error">{{errors.first('url')}}</span>
              </md-field>

              <md-field :class="{'md-input-invalid': errors.has('thumbnail')}">
                <label>{{$lang.edit.form.thumbnail_url}}
                  <span>
                    <md-icon>help</md-icon>
                    <md-tooltip md-direction="right">{{$lang.edit.form.thumbnail_url_tooptip}}</md-tooltip>
                  </span>
                </label>
                <md-input v-model="data.thumbnail" v-validate name="thumbnail" data-vv-rules="url"></md-input>
                <span class="md-error">{{errors.first('thumbnail')}}</span>
              </md-field>

              <md-field>
                <label for="license">{{$lang.edit.form.license}}</label>
                <md-input v-model="data.licenses" name="license"></md-input>
              </md-field>

              <md-field>
                <label for="contentCategory">{{$lang.edit.form.categorie}}</label>
                <md-select v-model="data.contentCategory" name="contentCategory" id="contentCategory">
                  <md-option value="">/</md-option>
                  <md-option value="atomic">Atomic</md-option>
                  <md-option value="interactive">Interactive</md-option>
                </md-select>
              </md-field>

              <section>
                <md-chips id="tags" v-model="data.tags" :md-max="10"
                          :md-placeholder="($lang.edit.form.tags)+'... ('+($lang.edit.form.max)+' 10)'"></md-chips>
              </section>
            </form>
          </md-card-content>
          <md-card-actions>
            <md-button class="delete" v-if="$route.params.id" @click="dialog.active = true">{{$lang.buttons.delete}}
            </md-button>
            <confirmDialog v-bind:config="dialog" @confirm="deleteContent"/>
            <md-button v-on:click="$router.go(-1)" style="color: initial;">{{$lang.buttons.cancel}}</md-button>
            <md-button class="md-primary" type="submit" form="contentForm">{{$lang.buttons.save}}</md-button>
          </md-card-actions>
        </md-card>
      </div>
      <div class="grid-xl-4 grid-s-12">
        <div class="preview-wrapper">
          <h2>{{$lang.edit.livepreview}}:</h2>
          <contentCard v-bind:data="data" v-bind:readOnly="true"></contentCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import VeeValidate from 'vee-validate';

  Vue.use(VeeValidate);

  const contentCard = () => import(/* webpackChunkName: "contentCard" */ '@/components/base/contentCard.vue');
  const confirmDialog = () => import(/* webpackChunkName: "confirmDialog" */ '@/components/dialogs/confirm.vue');

  export default {
    components: {
      contentCard,
      confirmDialog,
    },
    name: 'contentForm',
    data() {
      return {
        data: {
          providerName: '',
          url: '',
          title: '',
          description: '',
          thumbnail: '',
          contentCategory: '',
          licenses: [],
          tags: [],
        },
        dialog: {
          active: false,
          title: this.$lang.edit.dialog.title,
          content: this.$lang.edit.dialog.content,
          confirm: this.$lang.edit.dialog.confirm,
          cancle: this.$lang.edit.dialog.cancle,
        },
      };
    },
    methods: {
      loadContent() {
        if (this.$route.params.id) {
          this.$http.get(this.$config.API.baseUrl + this.$config.API.port + this.$config.API.getPath + this.$route.params.id, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
          })
            .then((response) => {
              // JSON responses are automatically parsed.
              this.data = response.data;
            })
            .catch((e) => {
              this.errors.push(e);
            });
        } else {
          this.data = {tags: []};
        }
      },
      validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.submitContent();
          }
        });
      },
      submitContent(event) {
        const d = this.data;
        const newData = {
          providerName: d.providerName,
          url: d.url,
          title: d.title,
          description: d.description,
          thumbnail: d.thumbnail,
          contentCategory: d.contentCategory,
          licenses: d.licenses,
          tags: d.tags,
        };
        if (this.$route.params.id) {
          axios.patch(this.$config.API.baseUrl + this.$config.API.pushPort + this.$config.API.pushContentPath + this.$route.params.id, newData, {
            headers: {Authorization: `Bearer ${localStorage.getItem('jwt')}`},
          });
        } else {
          axios.post(this.$config.API.baseUrl + this.$config.API.pushPort + this.$config.API.pushContentPath, newData, {
            headers: {Authorization: `Bearer ${localStorage.getItem('jwt')}`},
          });
        }
      },
      deleteContent() {
        window.alert('deleted content');
        this.$router.push({path: '/'});
      },
    },
    created() {
      this.loadContent();
    },
    watch: {
      $route(to, from) {
        this.loadContent();
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .gutter > div {
    padding: 5px;
  }

  .md-card {
    width: 100%;
  }

  .preview-wrapper {
    display: block;
    width: 100%;
  }

  textarea {
    min-height: 12rem !important;
  }

  .md-card-actions {
    .delete {
      position: absolute;
      left: 8px;
    }
  }
  .wrapper {
    margin: 30px 5% 0 5%;
  }
</style>
