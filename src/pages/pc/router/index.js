import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "pc-about" */ '../views/demo/About.vue')
  },
  {
    path: '/table-demo',
    name: 'TableDemo',
    component: () =>
      import(
        /* webpackChunkName: "pc-table-demo" */ '../views/demo/TableDemo.vue'
      )
  },
  {
    path: '*',
    name: 'NotFound',
    component: () =>
      import(
        /* webpackChunkName: "pc-not-found" */ '../views/demo/NotFound.vue'
      )
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_PUBLIC_PATH + 'pc',
  routes
});

export default router;
