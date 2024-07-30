import {createRouter, createWebHistory} from 'vue-router';
import Login from '../components/Login.vue';
import Dashboard from '../components/Dashboard.vue';
import Register from '../components/Register.vue';

const routes = [
    {path: '/login', component: Login, meta: {requiresAuth: false}},
    {path: '/register', component: Register, meta: {requiresAuth: false}},
    {path: '/', component: Dashboard, meta: {requiresAuth: true}},
];

const router = createRouter({
    history: createWebHistory('/'), routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth) && !localStorage.getItem('jwt')) {
        next('/login');
    } else {
        next();
    }
});

export default router;
