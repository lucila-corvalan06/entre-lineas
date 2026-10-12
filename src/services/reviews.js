import { supabase } from './supabase.js';

/**
 * @typedef {Object} Review
 * @property {number} id
 * @property {string} user_id
 * @property {string} book_title
 * @property {string} author
 * @property {string} genre
 * @property {number} rating
 * @property {string} body
 * @property {string} created_at
 * @property {{id: string, email: string, display_name: string|null}} user_profiles
 */

// Pedimos todas las columnas de la reseña y, junto con ellas, los datos de quien la escribió.
const REVIEW_SELECT = '*, user_profiles(id, email, display_name)';

/**
 * Guarda una reseña nueva.
 *
 * @param {{user_id: string, book_title: string, author: string, genre: string, rating: number, body: string}} data
 * @returns {Promise<void>}
 */
export async function createReview({ user_id, book_title, author, genre, rating, body }) {
    const { error } = await supabase
        .from('reviews')
        .insert({ user_id, book_title, author, genre, rating, body });

    if (error) {
        console.error('[services/reviews.js createReview] Error al crear la reseña: ', error);
        throw new Error(error.message);
    }
}

/**
 * Trae todas las reseñas, de la más nueva a la más vieja.
 *
 * @returns {Promise<Review[]>}
 */
export async function getReviews() {
    const { data, error } = await supabase
        .from('reviews')
        .select(REVIEW_SELECT)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[services/reviews.js getReviews] Error al traer las reseñas: ', error);
        throw new Error(error.message);
    }

    return data;
}

/**
 * Trae las reseñas de un usuario, de la más nueva a la más vieja.
 *
 * @param {string} userId
 * @returns {Promise<Review[]>}
 */
export async function getReviewsByUserId(userId) {
    const { data, error } = await supabase
        .from('reviews')
        .select(REVIEW_SELECT)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[services/reviews.js getReviewsByUserId] Error al traer las reseñas del usuario: ', error);
        throw new Error(error.message);
    }

    return data;
}

/**
 * Trae una reseña por su id, junto con los datos de su autor.
 *
 * @param {number} id
 * @returns {Promise<Review>}
 */
export async function getReviewById(id) {
    // single() devuelve un solo objeto, y falla si no hay exactamente una fila.
    const { data, error } = await supabase
        .from('reviews')
        .select(REVIEW_SELECT)
        .eq('id', id)
        .single();

    if (error) {
        console.error('[services/reviews.js getReviewById] Error al traer la reseña: ', error);
        throw new Error(error.message);
    }

    return data;
}

/**
 * Avisa cada vez que se publica una reseña nueva.
 *
 * @param {(review: Review) => void} callback
 * @returns {() => void} Función para cancelar la suscripción.
 */
export function subscribeToNewReviews(callback) {
    // Realtime trabaja con canales: primero creamos uno.
    const reviewsChannel = supabase.channel('reviews');

    // Escuchamos los INSERT de la tabla reviews.
    reviewsChannel.on(
        'postgres_changes',
        {
            event: 'INSERT',
            schema: 'public',
            table: 'reviews',
        },
        async payload => {
            try {
                // El evento solo trae las columnas de la reseña, sin los datos del autor.
                // Por eso la pedimos de nuevo, ya con el autor incluido.
                const review = await getReviewById(payload.new.id);
                callback(review);
            } catch (error) {
                console.error('[services/reviews.js subscribeToNewReviews] Error al procesar la reseña nueva: ', error);
            }
        }
    );

    // Recién al suscribirnos empezamos a recibir los eventos.
    reviewsChannel.subscribe();

    // Devolvemos la función que cancela la suscripción.
    return () => reviewsChannel.unsubscribe();
}