// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
Vue.use(VueMaterial);

import VueCookies from 'vue-cookies'
Vue.use(VueCookies);

import VueResource from 'vue-resource'
Vue.use(VueResource);

import VueConfig from 'vue-config'
const configFile = require('./config');
const configs = configFile.configs;
Vue.use(VueConfig, configs);

const VueLang = require('vuejs-localization');
VueLang.requireAll(require.context('./lang', true, /\.js$/));
Vue.use(VueLang, {default:'de'});

Vue.config.silent = false;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
