import { createRouter, createWebHistory } from 'vue-router';

// Yolları doğru bir şekilde import ediyoruz
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue'; // Register bileşeni doğru şekilde import ediliyor

const routes = 
[
  { path: '/', name: 'Home', component: Home },
  { path: '/giris', name: 'Login', component: Login },
  { path: '/kayit', name: 'Register', component: Register }
];

const router = createRouter
({
  history: createWebHistory(),
  routes
});

export default router;
