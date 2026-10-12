<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseH1 from '../components/BaseH1.vue';
import { login } from '../services/auth.js';

const router = useRouter();

const user = ref({
    email: '',
    password: '',
});
const loading = ref(false);
const errorMessage = ref('');

async function handleSubmit() {
    try {
        loading.value = true;
        errorMessage.value = '';

        await login({
            email: user.value.email,
            password: user.value.password,
        });

        router.push('/');
    } catch (error) {
        // Mostramos el mensaje del error en pantalla.
        errorMessage.value = 'El email o la contraseña son incorrectos.';
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <BaseH1>Ingresar</BaseH1>

    <form action="#" @submit.prevent="handleSubmit">
        <div class="mb-3">
            <label for="email" class="block mb-2">Email</label>
            <input
                type="email"
                id="email"
                class="form-field"
                autocomplete="email"
                required
                v-model="user.email"
            >
        </div>
        <div class="mb-3">
            <label for="password" class="block mb-2">Contraseña</label>
            <input
                type="password"
                id="password"
                class="form-field"
                autocomplete="current-password"
                required
                v-model="user.password"
            >
        </div>

        <p v-if="errorMessage" role="alert" class="mb-3 text-red-700">{{ errorMessage }}</p>

        <button
            type="submit"
            class="btn-primary"
            :disabled="loading"
        >
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
    </form>
</template>