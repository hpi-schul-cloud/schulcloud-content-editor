<template>
  <form id="contentForm" @submit.prevent="validateBeforeSubmit" @change="itemChanged" v-bind:class="{ changed: isDirty }">
    <td>
        <md-field :class="{'md-input-invalid': errors.has('title')}">
          <md-input v-model="contentData.title" type="text"></md-input>
          <span class="md-error">{{errors.first('title')}}</span>
        </md-field>
    </td>
    <td>
        <md-field :class="{'md-input-invalid': errors.has('url')}">
          <md-input v-model="contentData.url"></md-input>
          <span class="md-error">{{errors.first('url')}}</span>
        </md-field>
    </td>
    <td class="hide-s">
        <md-field>
          <md-select v-model="contentData.licenses" id="license" multiple name="license">
            <md-option value="GPL">GPL</md-option>
            <md-option value="MIT">MIT</md-option>
            <md-option value="CC BY-SA">CC BY-SA</md-option>
            <md-option value="CC BY-NC-SA (KA default)">CC BY-NC-SA (KA default)</md-option>
            <md-option value="Standard Youtube">Standard Youtube</md-option>
          </md-select>
        </md-field>
    </td>
    <td class="hide-m">
        <md-field>
          <md-select v-model="contentData.contentCategory" name="contentCategory" id="contentCategory">
            <md-option value="atomic">Atomic</md-option>
            <md-option value="interactive">Interactive</md-option>
          </md-select>
        </md-field>
    </td>
    <td>
      <md-button class="md-icon-button" @click="dialog.active = true"><md-icon>delete</md-icon></md-button>
      <confirmDialog v-bind:config="dialog" @confirm="deleteContent" />
      <md-button class="md-icon-button md-primary" type="submit"><md-icon>save</md-icon></md-button>
    </td>
  </form>
</template>

<script>
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);

/* load confirmDialog async */
const confirmDialog = () => import(
  /* webpackChunkName: "confirmDialog" */ './dialogs/confirm.vue');

export default {
  components: {
    confirmDialog,
  },
  name: 'contentTableRow',
  props: ['contentData'],
  data() {
    return {
      isDirty: false,
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
    required(item) {
      return (item && item != '');
    },
    isUrl(item) {
      return (item.match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi));
    },
    maxLength(text, length) {
      return (text.length <= length);
    },
    validateBeforeSubmit() {
      if (this.isUrl(this.contentData.url) && this.required(this.contentData.title)) {
        alert('Form Submitted!');
        this.submitContent();
        return;
      }
      alert('Correct the errors!');
    },
    submitContent(event) {
      this.clearItemChanged();

      if (this.$route.params.id) {
        this.$http.patch(this.$config.API.baseUrl + this.$config.API.pushPort + this.$config.API.pushContentPath + this.contentData._id, this.contentData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
        });
      } else {
        this.$http.post(this.$config.API.baseUrl + this.$config.API.pushPort + this.$config.API.pushContentPath, this.contentData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
        });
      }
    },
    itemChanged() {
      this.isDirty = true;
    },
    clearItemChanged() {
      this.isDirty = false;
    },
    deleteContent() {
      this.clearItemChanged();
      /* TODO - send async delete */
      this.$emit('delete', this.contentData._id);
    },
  },
  watch: {
    'data.contentCategory': function () {
      this.itemChanged();
    },
    'data.licenses': function () {
      this.itemChanged();
    },
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
        .md-field{
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

.changed {
  background-color: lightgoldenrodyellow;
}
</style>
