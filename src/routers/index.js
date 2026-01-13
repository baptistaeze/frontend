import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Products from '../views/Products.vue';
import CategoryProducts from '../views/CategoryProducts.vue'

const routes = [
 { path:'/login', component:Login },
 { path:'/', component:Products },
 { path:'/products', component:Products },
  { path: '/dashboard', component: Dashboard, meta: { auth: true }, },
  { path: '/products/category/:id', component: CategoryProducts },
];

const router = createRouter({
 history:createWebHistory(),
 routes
});

router.beforeEach((to,from,next)=>{
 const token = localStorage.getItem('token');
 if(to.meta.auth && !token){
   next('/login');
 }else{
   next();
 }
});

export default router;
