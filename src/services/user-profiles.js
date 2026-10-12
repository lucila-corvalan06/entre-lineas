import { supabase } from './supabase.js';

/** 
 * Crea el perfil de un usuario recién registrado.
 * 
 * @param {{id: string, email: string}} data
 * @returns { Promise<void>}
*/
export async function createUserProfile({ id, email }) {
    const { error } = await supabase
        .from('user_profiles')
        .insert({ id, email });

    if (error) {
        console.error('[services/user-profiles.js createUserProfile] Error al crear el perfil: ', error);
        throw new Error(error.message);
    }
}

/**
 * Trae el perfil de un usuario por su id.
 *
 * @param { string } id
 * @returns {Promise<{id: string, email: string, display_name: string|null, bio: string|null, created_at: string}>}
*/
export async function getUserProfileById(id) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select()
        .eq('id', id);
    
    if (error) {
        console.error('[services/user-profiles.js getUserProfileById] Error al traer el perfil: ', error);
        throw new Error(error.message);
    }

    return data[0];
}

/**
 * Actualiza los datos editables del perfil de un usuario.
 *
 * @param {string} id
 * @param {{display_name?: string|null, bio?: string|null}} data
 * @returns {Promise<void>}
 */
export async function updateUserProfile(id, data) {
    const { error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('id', id);

    if (error) {
        console.error('[services/user-profiles.js updateUserProfile] Error al actualizar el perfil: ', error);
        throw new Error(error.message);
    }
}