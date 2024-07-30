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
    if (to.matched.some(record => record.meta.requiresAuth) && !localStorage.getObject('loggedInUser')) {
        next('/login');
    } else {
        next();
    }
});

Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function (key) {
    return JSON.parse(this.getItem(key));
}

export default router;
