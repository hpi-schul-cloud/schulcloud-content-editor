// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import VueMaterial from 'vue-material'
import VueProgressBar from 'vue-progressbar'
import 'vue-material/dist/vue-material.min.css'
import VueCookies from 'vue-cookies';
import VueResource from 'vue-resource';
import VueConfig from 'vue-config';
import './registerServiceWorker'

Vue.use(VueMaterial);

Vue.use(VueCookies);

Vue.use(VueResource);

const configFile = require('./config');
Vue.use(VueConfig, configFile.default.configs);

const VueLang = require('vuejs-localization');

VueLang.requireAll(require.context('./lang', true, /\.js$/));
Vue.use(VueLang, {default: 'de'});

const options = {
  color: '#ffffff',
  failedColor: '#874b4b',
  thickness: '5px',
  transition: {
    speed: '1s',
    opacity: '0.3s',
    termination: 400
  },
  autoRevert: true,
  location: 'top',
  inverse: false
};

Vue.use(VueProgressBar, options);

Vue.config.silent = false;
Vue.config.performance = true;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',
}).$mount("#app");
