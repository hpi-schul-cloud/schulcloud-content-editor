import Vue from 'vue';
import Router from 'vue-router';
const overview = () => import(/* webpackChunkName: "overview" */ '@/components/overview.vue');
const searchContent = () => import(/* webpackChunkName: "listContent" */ '@/components/searchContent.vue');
const contentForm = () => import(/* webpackChunkName: "edit" */ '@/components/edit.vue');
/*
import overview from '@/components/overview';
import listContent from '@/components/listContent';
import contentForm from '@/components/edit';
*/

Vue.use(Router);

export default new Router({
  routes: [
    {path: '/',         name: 'main',   component: overview,    },
    {path: '/search',   name: 'search', component: searchContent, },
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
