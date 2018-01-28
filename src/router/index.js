import Vue from 'vue';
import Router from 'vue-router';
const overview = () => import(/* webpackChunkName: "overview" */ '@/components/overview.vue');
const contentStats = () => import(/* webpackChunkName: "listContent" */ '@/components/contentStats.vue');
const contentForm = () => import(/* webpackChunkName: "edit" */ '@/components/edit.vue');

Vue.use(Router);

export default new Router({
  routes: [
    {path: '/',         name: 'main',   component: overview,    },
    {path: '/stats',    name: 'stats',  component: contentStats, },
    {path: '/create',   name: 'create', component: contentForm, },
    {path: '/edit/:id', name: 'edit',   component: contentForm, },
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
        return savedPosition
    } else {
        return { x: 0, y: 0 }
    }
  },
});
