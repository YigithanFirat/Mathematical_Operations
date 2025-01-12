import { createRouter, createWebHistory } from 'vue-router';
import { createStore } from 'vuex';

import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Members from '../components/Members.vue';
import Settings from '../components/Settings.vue';
import History from '../components/History.vue';

const routes = 
[
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/members', name: 'Members', component: Members },
  { path: '/settings', name: 'Settings', component: Settings },
  { path: '/history', name: 'History', component: History}
];


const router = createRouter
({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;