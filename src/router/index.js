import { createRouter, createWebHistory } from 'vue-router';
import NetworkTest from '../views/NetworkTest.vue';

const routes = [
  {
    path: '/',
    name: 'NetworkTest',
    component: NetworkTest,
    // You can add props or meta fields here if needed later
    // Example: props: route => ({ queryID: route.query.uft_id, ... })
    // Though the component reads from useRoute() directly, which is fine.
  },
  // You can add other routes here if the application grows
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import('../views/About.vue') // Lazy load example
  // }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'), // BASE_URL is for Vite projects under a sub-path
  routes,
});

export default router;
