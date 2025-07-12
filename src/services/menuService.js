import axios from "axios";

const API_URL = "http://localhost:8000/core/";


/**
 * Obtiene la lista completa de ítems del menú disponibles en el sistema.
 *
 * @returns {Promise<Object[]>} - Arreglo de objetos que representan ítems del menú.
 */
export const getMenuItems = async () => {
    const res = await axios.get(`${API_URL}menu-items/`)
    return res.data;
};


/**
 * Crea un nuevo ítem de menú en el sistema.
 *
 * @param {Object} data - Datos del nuevo ítem (nombre, categoría, unidad, etc.).
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<Object>} - Objeto del ítem de menú recién creado.
 */
export const createMenuItem = async (data, token) => {
    return await axios.post(`${API_URL}menu-items/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
};


/**
 * Actualiza un ítem de menú existente.
 *
 * @param {number|string} id - ID del ítem de menú a editar.
 * @param {Object} data - Datos actualizados del ítem.
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<Object>} - Objeto actualizado del ítem de menú.
 */
export const updateMenuItem = async (id, data, token) => {
    return await axios.patch(`${API_URL}edit/menu-item/${id}/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
};


/**
 * Elimina un ítem de menú por su ID.
 *
 * @param {number|string} id - ID del ítem a eliminar.
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<Object>} - Respuesta del backend con estado o confirmación.
 */
export const deleteMenuItem = async (id, token) => {
    const res = await axios.delete(`${API_URL}menu-items/${id}/`, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
    });
    return res;
};


/**
 * Obtiene la lista de turnos (shifts) disponibles.
 *
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<Object[]>} - Lista de turnos existentes.
 */
export const getShifts = async (token) => {
    const res = await axios.get(`${API_URL}shifts/`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
    });
    return res.data;
};


/**
 * Asocia un conjunto de ítems de menú a un turno específico.
 *
 * @param {number|string} shiftId - ID del turno.
 * @param {Array<number>} itemIds - Arreglo con los IDs de los ítems del menú.
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<Object>} - Turno actualizado con los ítems asignados.
 */
export const updateShiftMenuItems = async (shiftId, itemIds, token) => {
    const res = await axios.patch(
      `${API_URL}shifts/${shiftId}/edit/`,
      { menu_items: itemIds },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
};


/**
 * Activa o desactiva el menú asignado a un turno.
 *
 * @param {number|string} shiftId - ID del turno.
 * @param {boolean} currentValue - Valor actual del estado (true = activo).
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<Object>} - Turno actualizado con el nuevo estado de activación.
 */
export const toggleShiftMenuActive = async (shiftId, currentValue, token) => {
    const res = await axios.patch(
      `${API_URL}shifts/${shiftId}/edit/`,
      { menu_active: !currentValue },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
};
  
  