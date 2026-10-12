import { supabase } from './supabase.js';
import { createUserProfile, getUserProfileById, updateUserProfile } from './user-profiles.js';

// Datos del usuario autenticado. Es el "subject" del patrón Observer.
let userData = {
    id: null,
    email: null,
    display_name: null,
    bio: null,
};

// Funciones que quieren enterarse cuando cambie el usuario.
let observers = [];

// Supabase ejecuta este callback cada vez que alguien inicia o cierra sesión.
supabase.auth.onAuthStateChange((event, session) => {
    if (session !== null) {
        // Avisamos enseguida con los datos básicos, así cambia el menú.
        userData = {
            ...userData,
            id: session.user.id,
            email: session.user.email,
        };
        notifyAll();

        // Después completamos con el perfil.
        getUserProfileById(userData.id).then(profile => {
            userData = {
                ...userData,
                display_name: profile?.display_name,
                bio: profile?.bio,
            };
            notifyAll();
        });
    } else {
        // Sin sesión, volvemos a los valores vacíos.
        userData = {
            id: null,
            email: null,
            display_name: null,
            bio: null,
        };
        notifyAll();
    }
});

/**
 * Permite suscribirse a los cambios del usuario autenticado.
 *
 * @param {(user: {id: string|null, email: string|null, display_name: string|null, bio: string|null}) => void} callback
 * @returns {() => void} Función para cancelar la suscripción.
 */
export function subscribeToAuthUserChanges(callback) {
    observers.push(callback);

    // Avisamos enseguida con el estado actual.
    notify(callback);

    // Devolvemos la función que quita este callback de la lista.
    return () => {
        observers = observers.filter(observer => observer !== callback);
    };
}

/**
 * Le pasa a un observer una copia de los datos del usuario.
 *
 * @param {(user: object) => void} callback
 */
function notify(callback) {
    callback({ ...userData });
}

/**
 * Avisa a todos los observers suscritos.
 */
function notifyAll() {
    observers.forEach(notify);
}

/**
 * Crea una cuenta nueva junto con su perfil.
 * @param {{email: string, password: string}} data
 * @returns {Promise<import('@supabase/supabase-js').User>}
 */
export async function register({ email, password }) {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        console.error('[services/auth.js register] Error al crear la cuenta: ', error);
        throw new Error(error.message);
    }

    // Creamos el perfil después del usuario, porque user_profiles.id referencia a auth.users.
    await createUserProfile({ id: data.user.id, email });

    return data.user;
}

/**
 * Inicia sesión con email y contraseña.
 * @param {{email: string, password:  string}} data
 * @returns {Promise<import('@supabase/supabase-js').User>}
 */
export async function login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error('[services/auth.js login] Error al iniciar sesión: ', error);
        throw new Error(error.message);
    }

    return data.user;
}

/**
 * Cierra la sesión del usuario autenticado.
 * @returns {Promise<void>}
 */
export async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('[services/auth.js logout] Error al cerrar sesión: ', error);
        throw new Error(error.message);
    }
}

/**
 * Actualiza el perfil del usuario autenticado.
 *
 * @param {{display_name: string|null, bio: string|null}} data
 * @returns {Promise<void>}
 */
export async function updateAuthUserProfile(data) {
    const changes = {
        display_name: data.display_name,
        bio: data.bio,
    };

    await updateUserProfile(userData.id, changes);

    // Actualizamos los datos locales y avisamos a los observers.
    userData = {
        ...userData,
        ...changes,
    };
    notifyAll();
}

/**
 * Cambia la contraseña del usuario autenticado.
 * 
 * @param {string} password
 * @returns {Promise<void>}
 */
export async function updateAuthUserPassword(password) {
    // updateUser() modifica los datos del usuario que tiene la sesión iniciada.
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        console.error('[services/auth.js updateAuthUserPassword] Error al cambiar la contraseña: ', error);
        throw new Error(error.message);
    }
}