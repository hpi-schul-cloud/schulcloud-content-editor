import Vue from 'vue';

import VueResource from 'vue-resource';

Vue.use(VueResource);

import VueConfig from 'vue-config';

const configFile = require('./config');

const configs = configFile.configs;
Vue.use(VueConfig, configs);

const VueLang = require('vuejs-localization');

VueLang.requireAll(require.context('./lang', true, /\.js$/));
Vue.use(VueLang, { default: 'de' });

import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';

Vue.use(VueMaterial);

// include vue-custom-element plugin to Vue
import VueCustomElement from 'vue-custom-element';

Vue.use(VueCustomElement);

// import and register your component(s)
import contentSearch from './SearchComponent';

Vue.customElement('content-search', contentSearch);
