import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import contentForm from '@/components/edit';
import contentCard from '@/components/contentCard';
import listContent from '@/components/listContent';

Vue.use(Router);

export default new Router({
  routes: [
    {path: '/create',component: contentForm,},
    {path: '/edit/:id',component: contentForm,},
    {path: '/', component: Hello,},   
    {path: '/card', component: contentCard,},   
    {path: '/list', component: listContent,},   
  ],
});
