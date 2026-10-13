<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import BaseH1 from '../components/BaseH1.vue';
import { subscribeToAuthUserChanges } from '../services/auth.js';

// Función para cancelar la suscripción al estado de autenticación.
let unsubscribeFromAuth = () => {};

const user = ref({
    id: null,
    email: null,
    display_name: null,
    bio: null,
});

onMounted(() => {
    unsubscribeFromAuth = subscribeToAuthUserChanges(userData => user.value = userData);
});

onUnmounted(() => unsubscribeFromAuth());
</script>

<template>
    <section class="mx-auto mt-8 max-w-2xl rounded-lg border border-sage bg-white p-6 shadow-sm">
        <div class="flex items-end gap-4">
            <BaseH1>Mi perfil</BaseH1>
            <RouterLink to="/mi-perfil/editar" class="link mb-4">Editar</RouterLink>
        </div>

        <p class="mb-4">{{ user.bio || 'Todavía no escribiste tu biografía.' }}</p>

        <dl>
            <dt class="mb-0.5 font-bold">Email</dt>
            <dd class="mb-3 ps-4">{{ user.email }}</dd>
            <dt class="mb-0.5 font-bold">Nombre de usuario</dt>
            <dd class="mb-3 ps-4">{{ user.display_name || 'Sin especificar' }}</dd>
        </dl>
    </section>
</template>