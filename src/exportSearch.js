import Vue from 'vue';

import VueResource from 'vue-resource';
import VueConfig from 'vue-config';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
// include vue-custom-element plugin to Vue
import VueCustomElement from 'vue-custom-element';
// import and register your component(s)
import contentSearch from './SearchComponent';

Vue.use(VueResource);

const configFile = require('./config');

const configs = configFile.configs;
Vue.use(VueConfig, configs);

const VueLang = require('vuejs-localization');

VueLang.requireAll(require.context('./lang', true, /\.js$/));
Vue.use(VueLang, {default: 'de'});

Vue.use(VueMaterial);


Vue.use(VueCustomElement);


Vue.customElement('content-search', contentSearch);
