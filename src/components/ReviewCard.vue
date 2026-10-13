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
    <article class="mx-auto mb-4 max-w-2xl rounded-lg border border-sage bg-white p-4 shadow-sm">
        <header class="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
            <RouterLink :to="`/usuario/${review.user_id}`" class="link font-semibold">
                {{ review.user_profiles.display_name || review.user_profiles.email }}
            </RouterLink>
            <time :datetime="review.created_at">{{ formatDate(review.created_at) }}</time>
        </header>

        <h3 class="text-xl font-bold">{{ review.book_title }}</h3>
        <p class="mb-2 text-sm">de {{ review.author }} · {{ review.genre }}</p>
        <p class="mb-3 font-semibold text-terracotta">Puntaje: {{ review.rating }} de 5</p>
        <p class="break-words whitespace-pre-line">{{ review.body }}</p>
    </article>
</template>