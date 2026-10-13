<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { logout, subscribeToAuthUserChanges } from './services/auth.js';

const router = useRouter();
const route = useRoute();

const user = ref({
    id: null,
    email: null,
    display_name: null,
    bio: null,
});
const menuOpen = ref(false);

watch(() => route.path, () => menuOpen.value = false);

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
    <div class="flex min-h-screen flex-col bg-cream text-brown">
        <header class="bg-brown text-cream">
            <nav class="p-4 md:flex md:items-center md:gap-8" aria-label="Navegación principal">
                <div class="flex items-center justify-between">
                    <RouterLink to="/" class="text-xl">Entre líneas</RouterLink>

                    <button
                        type="button"
                        class="nav-link md:hidden"
                        :aria-expanded="menuOpen"
                        aria-controls="main-menu"
                        @click="menuOpen = !menuOpen"
                    >
                        <span class="sr-only">{{ menuOpen ? 'Cerrar menú' : 'Abrir menú' }}</span>
                        <span aria-hidden="true">☰</span>
                    </button>
                </div>

                <ul
                    id="main-menu"
                    class="mt-4 flex-col gap-4 md:mt-0 md:flex md:flex-row"
                    :class="menuOpen ? 'flex' : 'hidden'"
                >
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
        <footer class="flex items-center justify-center bg-brown p-6 text-cream">
            <p>Entre líneas &copy; 2026</p>
        </footer>
    </div>
</template>