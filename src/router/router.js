import { createRouter, createWebHistory } from 'vue-router';
import { subscribeToAuthUserChanges } from '../services/auth.js';
import Home from '../pages/Home.vue';
import Register from '../pages/Register.vue';
import Login from '../pages/Login.vue';
import MyProfile from '../pages/MyProfile.vue';
import EditProfile from '../pages/EditProfile.vue';
import NewReview from '../pages/NewReview.vue';
import UserProfile from '../pages/UserProfile.vue';

// Lista de rutas. Cada una es un objeto con su path y el componente que muestra.
// Las rutas que exigen estar logueada llevan meta: { requiresAuth: true }.
const routes = [
    { path: '/', component: Home },
    { path: '/crear-cuenta', component: Register },
    { path: '/ingresar', component: Login },
    { path: '/mi-perfil', component: MyProfile, meta: { requiresAuth: true } },
    { path: '/mi-perfil/editar', component: EditProfile, meta: { requiresAuth: true } },
    { path: '/nueva-resena', component: NewReview, meta: { requiresAuth: true } },
    { path: '/usuario/:id', component: UserProfile, meta: { requiresAuth: true } },
];

const router = createRouter({
    routes,
    history: createWebHistory(),
});

// Guardamos acá el estado de autenticación para consultarlo en el guard.
let user = {
    id: null,
    email: null,
};

subscribeToAuthUserChanges(userData => user = userData);

// Antes de cada navegación, si la ruta exige login y no hay usuario, redirigimos al login.
router.beforeEach(to => {
    if (to.meta?.requiresAuth && user.id === null) {
        return '/ingresar';
    }
});

export default router;