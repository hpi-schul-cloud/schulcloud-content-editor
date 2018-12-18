import Vue from 'vue';
import Router from 'vue-router';

const overviewPage = () => import(/* webpackChunkName: "overview" */ '@/components/pages/overview/overview.vue');
const statsPage = () => import(/* webpackChunkName: "stats" */ '@/components/pages/stats/stats.vue');
const editPage = () => import(/* webpackChunkName: "edit" */ '@/components/pages/edit/edit.vue');
const hostingPage = () => import(/* webpackChunkName: "hosting" */ '@/components/pages/hosting/hosting.vue');

Vue.use(Router);

export default new Router({
  routes: [
    {path: '/', name: 'main', component: overviewPage},
    {path: '/stats', name: 'stats', component: statsPage},
    {path: '/create', name: 'create', component: editPage},
    {path: '/edit/:id', name: 'edit', component: editPage},
    {path: '/hosting', name: 'hosting', component: hostingPage},
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return {x: 0, y: 0};
  },
});
