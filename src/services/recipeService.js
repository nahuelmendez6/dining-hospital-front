import axios from "axios";

const BASE_URL = "http://localhost:8000/core";


/**
 * Obtiene la lista de ingredientes de receta asociados a un ítem del menú.
 * 
 * @param {number|string} menuItemId - ID del ítem de menú.
 * @returns {Promise<Object[]>} - Lista de ingredientes de la receta.
 * @throws {Error} - Si ocurre un error en la solicitud.
 */
export const getRecipeIngredients = async (menuItemId) => {
  const res = await axios.get(`${BASE_URL}/menu-items/${menuItemId}/recipe/`);
  return res.data;
};


/**
 * Agrega un nuevo ingrediente a la receta de un ítem de menú.
 * 
 * @param {number|string} menuItemId - ID del ítem de menú.
 * @param {Object} data - Datos del ingrediente (ej. { ingredient_id, quantity, unit }).
 * @returns {Promise<Object>} - Ingrediente agregado con su ID y datos.
 * @throws {Error} - Si la solicitud falla.
 */
export const addRecipeIngredient = async (menuItemId, data) => {
  const res = await axios.post(`${BASE_URL}/menu-items/${menuItemId}/recipe/`, data);
  return res.data;
};


/**
 * Actualiza un ingrediente específico dentro de una receta.
 * 
 * @param {number|string} id - ID del ingrediente de receta (no del ingrediente en sí).
 * @param {Object} data - Datos actualizados (ej. cantidad o unidad).
 * @returns {Promise<Object>} - Objeto actualizado del ingrediente de receta.
 * @throws {Error} - Si ocurre un error en la solicitud.
 */
export const updateRecipeIngredient = async (id, data) => {
  const res = await axios.put(`${BASE_URL}/recipe-ingredient/${id}/`, data);
  return res.data;
};


/**
 * Elimina un ingrediente específico de una receta.
 * 
 * @param {number|string} id - ID del ingrediente de receta a eliminar.
 * @returns {Promise<Object>} - Respuesta del backend (confirmación o datos eliminados).
 * @throws {Error} - Si ocurre un error al eliminar.
 */
export const deleteRecipeIngredient = async (id) => {
  const res = await axios.delete(`${BASE_URL}/recipe-ingredient/${id}/`);
  return res.data;
};
