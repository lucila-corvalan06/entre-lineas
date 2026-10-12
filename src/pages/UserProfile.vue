<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import BaseH1 from '../components/BaseH1.vue';
import ReviewCard from '../components/ReviewCard.vue';
import { getUserProfileById } from '../services/user-profiles.js';
import { getReviewsByUserId } from '../services/reviews.js';

// useRoute() nos da acceso a los datos de la ruta actual.
const route = useRoute();

const profile = ref(null);
const reviews = ref ([]);
const loading = ref(true);
const errorMessage = ref('');

onMounted(async () => {
    try {
        const userId = route.params.id;

        //Pedimos el perfil y las reseñas a la vez, porque no dependen una de otra.
        [profile.value, reviews.value] = await Promise.all([
            getUserProfileById(userId),
            getReviewsByUserId(userId),
        ]);
    } catch (error) {
        // Mostramos un mensaje de error.
        errorMessage.value = 'No pudimos cargar el perfil. Intentá de nuevo más tarde.';
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <p v-if="loading">Cargando perfil...</p>
    <p v-else-if="errorMessage" role="alert" class="text-red-700">{{ errorMessage }}</p>
    <p v-else-if="!profile">No encontramos a ese usuario.</p>

    <template v-else>
        <BaseH1>{{ profile.display_name || profile.email }}</BaseH1>

        <p class="mb-6">{{ profile.bio || 'Este usuario todavía no escribió su biografía.' }}</p>

        <section aria-labelledby="reviews-title">
            <h2 id="reviews-title" class="mb-4 text-2xl">Sus reseñas</h2>

            <p v-if="reviews.length === 0">Todavía no publicó ninguna reseña.</p>
            <ReviewCard
                v-for="review in reviews"
                :key="review.id"
                :review="review"
            />
        </section>
    </template>
</template>