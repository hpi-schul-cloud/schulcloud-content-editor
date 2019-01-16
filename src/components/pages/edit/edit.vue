<template>
  <div
    md-gutter
    class="container-fluid grid"
  >
    <div class="grid-xl-8 grid-s-12">
      <MdCard>
        <MdCardHeader>
          <div
            v-if="$route.params.id"
            class="md-title"
          >
            {{ $lang.edit.title_edit }}
          </div>
          <div
            v-else
            class="md-title"
          >
            {{ $lang.edit.title_create }}
          </div>
        </MdCardHeader>
        <MdCardContent>
          <form
            id="contentForm"
            @submit.prevent="validateBeforeSubmit"
          >
            <MdField :class="{'md-input-invalid': errors.has('title')}">
              <label>{{ $lang.edit.form.title }}</label>
              <MdInput
                v-model="data.title"
                v-validate
                type="text"
                name="title"
                data-vv-rules="required"
              />
              <span class="md-error">
                {{ errors.first('title') }}
              </span>
            </MdField>

            <MdField :class="{'md-input-invalid': errors.has('description')}">
              <label>
                {{ $lang.edit.form.description }}
                <span>
                  <MdIcon>help</MdIcon>
                  <MdTooltip md-direction="right">
                    {{ $lang.edit.form.description_tooltip }}
                  </MdTooltip>
                </span>
              </label>
              <MdTextarea
                v-model="data.description"
                v-validate
                name="description"
                data-vv-rules="max:500"
                maxlength="500"
              />
              <span class="md-error">
                {{ errors.first('description') }}
              </span>
            </MdField>

            <MdField :class="{'md-input-invalid': errors.has('url')}">
              <label>{{ $lang.edit.form.url }}</label>
              <MdInput
                v-model="data.url"
                v-validate
                name="url"
                data-vv-rules="required|url"
              />
              <span class="md-error">
                {{ errors.first('url') }}
              </span>
            </MdField>

            <MdField :class="{'md-input-invalid': errors.has('thumbnail')}">
              <label>
                {{ $lang.edit.form.thumbnail_url }}
                <span>
                  <MdIcon>help</MdIcon>
                  <MdTooltip md-direction="right">
                    {{ $lang.edit.form.thumbnail_url_tooptip }}
                  </MdTooltip>
                </span>
              </label>
              <MdInput
                v-model="data.thumbnail"
                v-validate
                name="thumbnail"
                data-vv-rules="url"
              />
              <span class="md-error">
                {{ errors.first('thumbnail') }}
              </span>
            </MdField>

            <section>
              <MdChips
                id="license"
                v-model="data.licenses"
                :md-max="10"
                :md-placeholder="($lang.edit.form.license)+'... ('+($lang.edit.form.max)+' 10)'"
              />
            </section>

            <MdField>
              <label for="contentCategory">
                {{ $lang.edit.form.categorie }}
              </label>
              <MdSelect
                id="contentCategory"
                v-model="data.contentCategory"
                name="contentCategory"
              >
                <MdOption value="">
                  /
                </MdOption>
                <MdOption value="atomic">
                  Atomic
                </MdOption>
                <MdOption value="interactive">
                  Interactive
                </MdOption>
              </MdSelect>
            </MdField>

            <MdField>
              <label for="contentMimetype">
                {{ $lang.edit.form.mimetype }}
              </label>
              <MdSelect
                id="contentMimetype"
                v-model="data.mimeType"
                name="contentCategory"
              >
                <MdOption value="application">
                  application
                </MdOption>
                <MdOption value="audio">
                  audio
                </MdOption>
                <MdOption value="example">
                  example
                </MdOption>
                <MdOption value="image">
                  image
                </MdOption>
                <MdOption value="message">
                  message
                </MdOption>
                <MdOption value="model">
                  model
                </MdOption>
                <MdOption value="multipart">
                  multipart
                </MdOption>
                <MdOption value="text">
                  text
                </MdOption>
                <MdOption value="video">
                  video
                </MdOption>
              </MdSelect>
            </MdField>

            <section>
              <MdChips
                id="tags"
                v-model="data.tags"
                :md-max="10"
                :md-placeholder="($lang.edit.form.tags)+'... ('+($lang.edit.form.max)+' 10)'"
              />
            </section>
          </form>
        </MdCardContent>
        <MdCardActions>
          <MdButton
            v-if="$route.params.id"
            class="delete"
            @click="dialog.active = true"
          >
            {{ $lang.buttons.delete }}
          </MdButton>
          <ConfirmDialog
            :config="dialog"
            @confirm="deleteContent"
          />
          <MdButton
            style="color: initial;"
            @click="$router.go(-1)"
          >
            {{ $lang.buttons.cancel }}
          </MdButton>
          <MdButton
            class="md-primary"
            type="submit"
            form="contentForm"
          >
            {{ $lang.buttons.save }}
          </MdButton>
        </MdCardActions>
      </MdCard>
    </div>
    <div class="grid-xl-4 grid-s-12">
      <div class="preview-wrapper">
        <h2>{{ $lang.edit.livepreview }}:</h2>
        <ContentCard
          :data="data"
          :read-only="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);

const ContentCard = () => import(/* webpackChunkName: "ContentCard" */ '@/components/base/contentCard.vue');
const ConfirmDialog = () => import(/* webpackChunkName: "ConfirmDialog" */ '@/components/dialogs/confirm.vue');

export default {
	name: 'ContentForm',
	components: {
		ContentCard,
		ConfirmDialog,
	},
	data() {
		return {
			data: {
				providerName: '',
				url: '',
				title: '',
				description: '',
				thumbnail: '',
				contentCategory: '',
				licenses: ["Test License"],
				tags: [],
			},
			dialog: {
				active: false,
				title: this.$lang.edit.dialog.title,
				content: this.$lang.edit.dialog.content,
				confirm: this.$lang.edit.dialog.confirm,
				cancle: this.$lang.edit.dialog.cancle,
			},
			userInfo: JSON.parse(localStorage.getItem('userInfo')) || {},
		};
	},
	watch: {
		$route() {
			this.loadContent();
		},
	},
	created() {
		this.loadContent();
	},
	methods: {
		loadContent() {
			if (this.$route.params.id) {
				this.$http.get(this.$config.API.serverServerUrl + this.$config.API.getContentPath + this.$route.params.id, {
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
				this.data = {tags: [], licenses: [], providerName: this.userInfo.displayName.toString()};
			}
		},
		validateBeforeSubmit() {
			this.$validator.validateAll().then((result) => {
				if (result) {
					this.submitContent();
				}
			});
		},
		submitContent() {
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
				mimeType: d.mimeType,
			};
			let request;
			if (this.$route.params.id) {
				request = this.$http
					.patch(this.$config.API.contentServerUrl + this.$config.API.pushContentPath + this.$route.params.id, newData, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem('jwt')}`,
						},
					})
			} else {
				newData.originId = Date.now().toString();
				request = this.$http
					.post(this.$config.API.contentServerUrl + this.$config.API.pushContentPath, newData, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem('jwt')}`,
						},
					})
			}
			request.then(() => {
				this.$router.push({path: '/'});
			});
		},
		deleteContent() {
			this.$http.delete(this.$config.API.contentServerUrl + this.$config.API.pushContentPath + this.$route.params.id, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('jwt')}`,
				},
			}).then(() => {
				this.$router.push({path: '/'});
			});
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .container-fluid {
    padding: 30px 5% 0 5%;
  }
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
</style>
