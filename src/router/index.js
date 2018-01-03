import Vue from 'vue';
import Router from 'vue-router';
import contentForm from '@/components/edit';
import contentCard from '@/components/contentCard';
import listContent from '@/components/listContent';
import overview from '@/components/overview';

Vue.use(Router);

export default new Router({
  routes: [
    {path: '/create',component: contentForm,},
    {path: '/edit/:id',component: contentForm,},
    {path: '/', component: overview,},   
    {path: '/card', component: contentCard,},   
    {path: '/list', component: listContent,},   
  ],
});
