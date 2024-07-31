import {createRouter, createWebHistory} from 'vue-router';
import Login from '../components/Login.vue';
import Dashboard from '../components/Dashboard.vue';
import Register from '../components/Register.vue';
import CreateProject from "../components/CreateProject.vue";
import ViewProject from "../components/ViewProject.vue";
import EditProject from "../components/EditProject.vue";

const routes = [
    {path: '/login', component: Login, meta: {requiresAuth: false}},
    {path: '/register', component: Register, meta: {requiresAuth: false}},
    {path: '/', component: Dashboard, meta: {requiresAuth: true}},
    {path: '/create-project', component: CreateProject, meta: {requiresAuth: true}},
    {path: '/projects/:id', component: ViewProject, meta: {requiresAuth: true}},
    {path: '/edit-project/:id', component: EditProject, meta: {requiresAuth: true}},

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

export default router;
