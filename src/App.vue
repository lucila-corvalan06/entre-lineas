<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { logout, subscribeToAuthUserChanges } from './services/auth.js';

const router = useRouter();

const user = ref({
    id: null,
    email: null,
    display_name: null,
    bio: null,
});

// Función para cancelar la suscripción al estado de autenticación.
let unsubscribeFromAuth = () => {};

async function handleLogout() {
    try {
        await logout();
        router.push('/ingresar');
    } catch (error) {
        
    }
}

onMounted(() => {
    unsubscribeFromAuth = subscribeToAuthUserChanges(userData => user.value = userData);
});

onUnmounted(() => unsubscribeFromAuth());
</script>

<template>
    <div class="flex min-h-screen flex-col">
        <header class="bg-slate-700 text-white">
            <nav class="flex flex-wrap items-center gap-x-8 gap-y-2 p-4" aria-label="Navegación principal">
                <RouterLink to="/" class="text-xl">Entre líneas</RouterLink>
                <ul class="flex flex-wrap gap-x-4 gap-y-2">
                    <li>
                        <RouterLink to="/" class="nav-link">Inicio</RouterLink>
                    </li>

                    <template v-if="user.id !== null">
                        <li>
                            <RouterLink to="/nueva-resena" class="nav-link">Nueva reseña</RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/mi-perfil" class="nav-link">Mi perfil</RouterLink>
                        </li>
                        <li>
                            <form action="#" @submit.prevent="handleLogout">
                                <button type="submit" class="nav-link">{{ user.email }} (Cerrar sesión)</button>
                            </form>
                        </li>
                    </template>
                    <template v-else>
                        <li>
                            <RouterLink to="/ingresar" class="nav-link">Ingresar</RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/crear-cuenta" class="nav-link">Crear cuenta</RouterLink>
                        </li>
                    </template>
                </ul>
            </nav>
        </header>

        <main class="container mx-auto flex-1 p-4">
            <RouterView />
        </main>

        <footer class="flex items-center justify-center bg-gray-800 p-6 text-white">
            <p>Entre líneas &copy; 2026</p>
        </footer>
    </div>
</template>