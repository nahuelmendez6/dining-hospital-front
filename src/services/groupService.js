// services/groupService.js
import axios from 'axios';


/**
 * Obtiene la lista de grupos de usuario disponibles en el sistema.
 * 
 * Este endpoint es útil para cargar los grupos a los que se pueden asignar usuarios,
 * como "Administrador", "Cocina", "Personal", etc.
 *
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<Object[]>} - Arreglo de objetos que representan los grupos.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
export const getGroups = async (token) => {
  const response = await axios.get('http://localhost:8000/auth/get-groups/', {
    headers: {
        Authorization: `Bearer ${token}`,

    },
  });
  return response.data;
};
