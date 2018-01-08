import Vue from 'vue';
import Router from 'vue-router';
const overview = () => import(/* webpackChunkName: "overview" */ '@/components/overview.vue');
const listContent = () => import(/* webpackChunkName: "listContent" */ '@/components/listContent.vue');
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
    {path: '/list',     name: 'search', component: listContent, },
    {path: '/create',   name: 'create', component: contentForm, },
    {path: '/edit/:id', name: 'edit',   component: contentForm, },
  ],
});
