import { createRouter, createWebHistory } from 'vue-router';

import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Settings from '../components/Settings.vue';
import History from '../components/History.vue';
import Open from '../components/Open.vue';

const routes = 
[
  { path: '/home', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/settings', name: 'Settings', component: Settings },
  { path: '/history', name: 'History', component: History},
  { path: '/', name: 'Open', component: Open},
];

const router = createRouter
({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;