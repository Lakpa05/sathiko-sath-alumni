import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import './style.css';
import App from './App.vue';
import Home from './views/Home.vue';
import Alumni from './views/Alumni.vue';
import Join from './views/Join.vue';
import Events from './views/Events.vue';
import AdminLogin from './views/admin/AdminLogin.vue';
import AdminDashboard from './views/admin/AdminDashboard.vue';
import AdminAlumni from './views/admin/AdminAlumni.vue';

const routes=[
 {path:'/',component:Home},{path:'/alumni',component:Alumni},{path:'/join',component:Join},{path:'/events',component:Events},
 {path:'/admin/login',component:AdminLogin},{path:'/admin',component:AdminDashboard},{path:'/admin/alumni',component:AdminAlumni}
];
const router=createRouter({history:createWebHistory(),routes});
createApp(App).use(createPinia()).use(router).mount('#app');
