<script setup>
// La reseña que muestra la tarjeta, que llega desde la página que la usa.
defineProps({
    review: {
        type: Object,
        required: true,
    },
});

/**
 * Da formato a una fecha para mostrarla en pantalla.
 *
 * @param {string} isoDate
 * @returns {string}
 */
function formatDate(isoDate) {
    return new Date(isoDate).toLocaleDateString('es-AR');
}
</script>

<template>
    <article class="p-4 mb-4 border rounded">
        <h2 class="text-xl font-bold">{{ review.book_title }}</h2>
        <p>de {{ review.author }} · {{ review.genre }}</p>
        <p class="mb-2">Puntaje: {{ review.rating }} de 5</p>
        <p class="mb-2">{{ review.body }}</p>
        <footer class="text-sm text-gray-700">
            Reseña de
            <RouterLink :to="`/usuario/${review.user_id}`" class="link">
                {{ review.user_profiles.display_name || review.user_profiles.email }}
            </RouterLink>
            el <time :datetime="review.created_at">{{ formatDate(review.created_at) }}</time>
        </footer>
    </article>
</template>