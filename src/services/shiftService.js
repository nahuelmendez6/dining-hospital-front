import axios from 'axios';

const API_URL = 'http://localhost:8000/';


/**
 * Obtiene la lista de turnos (shifts) disponibles desde el backend.
 *
 * @param {string} token - Token de autenticación JWT.
 * @returns {Promise<Object[]>} - Lista de turnos registrados.
 * @throws {Error} - Si la solicitud falla (podrías capturarlo si quisieras un manejo más seguro).
 */
export const getShifts = async (token) => {

    const response = await axios.get(`${API_URL}core/shifts/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;

}

/**
 * Crea un nuevo turno en el sistema.
 *
 * @param {Object} shiftData - Datos del turno a crear (ej: nombre, hora inicio/fin).
 * @param {string} token - Token de autenticación JWT.
 * @returns {Promise<Object>} - Turno creado con sus datos completos.
 * @throws {Error} - Si la solicitud falla.
 */
export const createShift = async (shiftData, token) => {
    const response = await axios.post(`${API_URL}core/shifts/create/`, shiftData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };


/**
 * Edita un turno existente a partir de su ID.
 *
 * @param {number|string} id - ID del turno a editar.
 * @param {Object} shiftData - Datos actualizados del turno.
 * @param {string} token - Token de autenticación JWT.
 * @returns {Promise<Object>} - Turno actualizado.
 * @throws {Error} - Si la solicitud falla.
 */
export const editShift = async (id, shiftData, token) => {
    const response = await axios.patch(`${API_URL}core/shifts/${id}/edit/`, shiftData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

/**
 * Elimina un turno existente del sistema.
 * IMPORTANTE: Aunque se usa DELETE, los datos (ID) se envían en el cuerpo (`data`)
 * porque algunos servidores no aceptan el ID en la URL para `DELETE`.
 *
 * @param {string} token - Token de autenticación JWT.
 * @param {number|string} id - ID del turno a eliminar.
 * @returns {Promise<Object>} - Respuesta del servidor (confirmación de eliminación).
 * @throws {Error} - Si la solicitud falla.
 */
export const deleteShift = async (token, id) => {
    const response = await axios.delete(`${API_URL}core/shift/edit`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: { id },
    });
    return response.data;
};
