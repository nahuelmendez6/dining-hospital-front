import axios from "axios";

const API_URL = "http://localhost:8000/core/ingredients/";


/**
 * Obtiene la lista de todos los ingredientes disponibles.
 *
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<Object[]>} - Lista de ingredientes.
 * @throws {Error} - Si ocurre un error en la solicitud.
 */
export const getIngredients = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Crea un nuevo ingrediente.
 *
 * @param {Object} ingredient - Objeto con los datos del ingrediente a crear.
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<Object>} - Ingrediente creado.
 * @throws {Error} - Si ocurre un error en la solicitud.
 */
export const createIngredient = async (ingredient, token) => {
  const response = await axios.post(API_URL, ingredient, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


/**
 * Actualiza los datos de un ingrediente existente.
 *
 * @param {number|string} id - ID del ingrediente a actualizar.
 * @param {Object} ingredient - Objeto con los campos modificados.
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<Object>} - Ingrediente actualizado.
 * @throws {Error} - Si ocurre un error en la solicitud.
 */
export const updateIngredient = async (id, ingredient, token) => {
  const response = await axios.patch(`${API_URL}${id}/`, ingredient, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};



/**
 * Elimina un ingrediente del sistema.
 *
 * @param {number|string} id - ID del ingrediente a eliminar.
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<void>} - No retorna datos si la eliminación fue exitosa.
 * @throws {Error} - Si ocurre un error en la solicitud.
 */
export const deleteIngredient = async (id, token) => {
  await axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};