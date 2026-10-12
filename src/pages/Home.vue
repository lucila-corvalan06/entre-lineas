<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import BaseH1 from '../components/BaseH1.vue';
import { getReviews, subscribeToNewReviews } from '../services/reviews.js';
import ReviewCard from '../components/ReviewCard.vue';

// Función para cancelar la suscripción a las reseñas nuevas.
let unsubscribeFromNewReviews = () => {};

const reviews = ref([]);
const loading = ref(true);
const errorMessage = ref('');


onMounted(async () => {
    // Nos suscribimos a las reseñas nuevas para sumarlas al principio de la lista.
    unsubscribeFromNewReviews = subscribeToNewReviews(newReview => {
        // Evitamos duplicados, la reseña pudo haber llegado ya en la carga inicial.
        if (!reviews.value.some(review => review.id === newReview.id)) {
            reviews.value.unshift(newReview);
        }
    });

    try {
        reviews.value = await getReviews();
    } catch (error) {
        // Mostramos un mensaje de error.
        errorMessage.value = 'No pudimos cargar las reseñas. Intentá de nuevo más tarde.';
    } finally {
        loading.value = false;
    }
});

onUnmounted(() => unsubscribeFromNewReviews());
</script>

<template>
    <BaseH1>Últimas reseñas</BaseH1>

    <p v-if="loading">Cargando reseñas...</p>
    <p v-else-if="errorMessage" role="alert" class="text-red-700">{{ errorMessage }}</p>
    <p v-else-if="reviews.length === 0">Todavía no hay reseñas. ¡Publicá la primera!</p>

    <section v-else aria-label="Listado de reseñas">
        <ReviewCard
            v-for="review in reviews"
            :key="review.id"
            :review="review"
        />
    </section>
</template>