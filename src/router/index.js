import { createRouter, createWebHistory } from 'vue-router';

// Yolları doğru bir şekilde import ediyoruz
import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue'; // Register bileşeni doğru şekilde import ediliyor

const routes = 
[
  { path: '/', name: 'Home', component: Home },
  { path: '/giris', name: 'Login', component: Login },
  { path: '/kayit', name: 'Register', component: Register }
];

const router = createRouter
({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
