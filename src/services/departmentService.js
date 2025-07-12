// services/departmentService.js
const API_URL = 'http://localhost:8000/'


/**
 * Obtiene la lista de departamentos desde el backend.
 * 
 * Este servicio se utiliza para cargar las áreas o sectores del sistema,
 * por ejemplo: "Administración", "Cocina", "Mantenimiento", etc.
 *
 * @param {string} token - Token JWT de autenticación del usuario actual.
 * @returns {Promise<Object[]>} - Arreglo de objetos que representan los departamentos.
 * @throws {Error} - Lanza un error si la solicitud falla o el servidor responde con estado no exitoso.
 */
export async function getDepartments(token) {
  const response = await fetch(`${API_URL}core/list-departments`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, // o 'Token' si usás TokenAuth
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error al obtener departamentos:', response.status, errorText);
    throw new Error('Error al obtener departamentos');
  }

  return await response.json();
}
