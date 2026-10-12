<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseH1 from '../components/BaseH1.vue';
import { subscribeToAuthUserChanges } from '../services/auth.js';
import { createReview } from '../services/reviews.js';

const router = useRouter();

// Géneros que se pueden elegir en el formulario.
const genres = [
    'Novela',
    'Fantasía',
    'Ciencia ficción',
    'Policial',
    'Romance',
    'Terror',
    'Biografía',
    'Ensayo',
    'Poesía',
    'Otro',
];

// Función para cancelar la suscripción al estado de autenticación.
let unsubscribeFromAuth = () => {};

const user = ref({
    id: null,
});

const review = ref({
    book_title: '',
    author: '',
    genre: '',
    rating: '',
    body: '',
});
const loading = ref(false);
const errorMessage = ref('');

async function handleSubmit() {
    try {
        loading.value = true;
        errorMessage.value = '';

        await createReview({
            user_id: user.value.id,
            book_title: review.value.book_title,
            author: review.value.author,
            genre: review.value.genre,
            rating: review.value.rating,
            body: review.value.body,
        });

        router.push('/');
    } catch (error) {
        // Mostramos un mensaje en español, porque el sitio está en español.
        errorMessage.value = 'No pudimos publicar la reseña. Intentá de nuevo.';
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    unsubscribeFromAuth = subscribeToAuthUserChanges(userData => user.value = userData);
});

onUnmounted(() => unsubscribeFromAuth());
</script>

<template>
    <BaseH1>Nueva reseña</BaseH1>

    <form action="#" @submit.prevent="handleSubmit">
        <div class="mb-3">
            <label for="book_title" class="block mb-2">Título del libro</label>
            <input
                type="text"
                id="book_title"
                class="w-full p-2 border rounded"
                required
                v-model="review.book_title"
            >
        </div>
        <div class="mb-3">
            <label for="author" class="block mb-2">Autor o autora</label>
            <input
                type="text"
                id="author"
                class="w-full p-2 border rounded"
                required
                v-model="review.author"
            >
        </div>
        <div class="mb-3">
            <label for="genre" class="block mb-2">Género</label>
            <select
                id="genre"
                class="w-full p-2 border rounded"
                required
                v-model="review.genre"
            >
                <option value="" disabled>Elegí un género</option>
                <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="rating" class="block mb-2">Puntaje</label>
            <select
                id="rating"
                class="w-full p-2 border rounded"
                required
                v-model.number="review.rating"
            >
                <option value="" disabled>Elegí un puntaje</option>
                <option v-for="n in 5" :key="n" :value="n">{{ n }} de 5</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="body" class="block mb-2">Tu reseña</label>
            <textarea
                id="body"
                class="w-full p-2 border rounded"
                rows="6"
                required
                v-model="review.body"
            ></textarea>
        </div>

        <p v-if="errorMessage" role="alert" class="mb-3 text-red-700">{{ errorMessage }}</p>

        <button
            type="submit"
            class="btn-primary"
            :disabled="loading"
        >
            {{ loading ? 'Publicando...' : 'Publicar reseña' }}
        </button>
    </form>
</template>