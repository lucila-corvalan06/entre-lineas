<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import BaseH1 from '../components/BaseH1.vue';
import { subscribeToAuthUserChanges, updateAuthUserProfile, updateAuthUserPassword } from '../services/auth.js';

// Función para cancelar la suscripción al estado de autenticación.
let unsubscribeFromAuth = () => {};

const profile = ref({
    display_name: '',
    bio: '',
});
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

async function handleSubmit() {
    try {
        loading.value = true;
        errorMessage.value = '';
        successMessage.value = '';

        await updateAuthUserProfile({
            display_name: profile.value.display_name,
            bio: profile.value.bio,
        });

        successMessage.value = 'Tus datos se actualizaron correctamente.';
    } catch (error) {
        // Mostramos un mensaje de error.
        errorMessage.value = 'No pudimos guardar los cambios. Intentá de nuevo.';
    } finally {
        loading.value = false;
    }
}

const password = ref('');
const passwordLoading = ref(false);
const passwordErrorMessage = ref('');
const passwordSuccessMessage = ref('');

async function handlePasswordSubmit() {
    try {
        passwordLoading.value = true;
        passwordErrorMessage.value = '';
        passwordSuccessMessage.value = '';

        await updateAuthUserPassword(password.value);

        // Vaciamos el campo para no dejar la contraseña a la vista.
        password.value = '';
        passwordSuccessMessage.value = 'Tu contraseña se cambió correctamente.';
    } catch (error) {
        // Mostramos un mensaje de error.
        passwordErrorMessage.value = 'No pudimos cambiar la contraseña. Probá con una distinta de la actual.';
    } finally {
        passwordLoading.value = false;
    }
}

onMounted(() => {
    // Cargamos el formulario con los datos actuales del usuario.
    unsubscribeFromAuth = subscribeToAuthUserChanges(userData => profile.value = {
        display_name: userData.display_name,
        bio: userData.bio,
    });
});

onUnmounted(() => unsubscribeFromAuth());
</script>

<template>
    <section class="mx-auto mt-8 max-w-md rounded-lg border border-sage bg-white p-6 shadow-sm">
    <BaseH1>Editar mi perfil</BaseH1>

    <form action="#" @submit.prevent="handleSubmit">
        <div class="mb-3">
            <label for="display_name" class="block mb-2">Nombre de usuario</label>
            <input
                type="text"
                id="display_name"
                class="form-field"
                autocomplete="nickname"
                v-model="profile.display_name"
            >
        </div>
        <div class="mb-3">
            <label for="bio" class="block mb-2">Biografía</label>
            <textarea
                id="bio"
                class="form-field"
                rows="4"
                v-model="profile.bio"
            ></textarea>
        </div>

        <p v-if="errorMessage" role="alert" class="mb-3 text-red-700">{{ errorMessage }}</p>
        <p v-if="successMessage" role="status" class="mb-3 text-green-700">{{ successMessage }}</p>

        <button
            type="submit"
            class="btn-primary w-full"
            :disabled="loading"
        >
            {{ loading ? 'Guardando...' : 'Guardar cambios' }}
        </button>
    </form>
    </section>

    <section class="mx-auto mt-6 max-w-md rounded-lg border border-sage bg-white p-6 shadow-sm" aria-labelledby="password-title">
        <h2 id="password-title" class="mb-4 text-2xl">Cambiar contraseña</h2>

        <form action="#" @submit.prevent="handlePasswordSubmit">
            <div class="mb-3">
                <label for="new-password" class="block mb-2">Nueva contraseña</label>
                <input
                    type="password"
                    id="new-password"
                    class="form-field"
                    autocomplete="new-password"
                    minlength="6"
                    required
                    v-model="password"
                >
            </div>

            <p v-if="passwordErrorMessage" role="alert" class="mb-3 text-red-700">{{ passwordErrorMessage }}</p>
            <p v-if="passwordSuccessMessage" role="status" class="mb-3 text-green-700">{{ passwordSuccessMessage }}</p>

            <button
                type="submit"
                class="btn-primary w-full"
                :disabled="passwordLoading"
            >
                {{ passwordLoading ? 'Cambiando...' : 'Cambiar contraseña' }}
            </button>
        </form>
    </section>
    <p class="mx-auto mt-6 max-w-md">
        <RouterLink to="/mi-perfil" class="link">Volver a mi perfil</RouterLink>
    </p>
</template>