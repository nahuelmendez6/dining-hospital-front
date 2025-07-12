import axios from 'axios';

const API_URL = 'http://localhost:8000/';

/**
 * Crea un nuevo usuario enviando los datos al backend.
 * 
 * @param {Object} userData - Datos del usuario a crear.
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object>} - Respuesta completa del servidor.
 * @throws {Error} - Si hay un error en la solicitud.
 */
export const createUser = async (userData, token) => {
    try {
        // Preparar los datos exactamente como los espera el backend
        const requestData = {
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            // department_id: parseInt(userData.department),
            // department: parseInt(userData.department),
            dni: userData.dni,
            group: userData.group,
            observations: userData.observations,
        };

        console.log('Datos exactos que se envían al servidor:', JSON.stringify(requestData, null, 2));

        const response = await axios.post(`${API_URL}auth/create/user`, requestData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response;
    } catch (error) {
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            console.error('Respuesta completa del servidor:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                headers: error.response.headers
            });
            
            // Si hay un mensaje de error específico en la respuesta, lo lanzamos
            if (error.response.data) {
                throw new Error(JSON.stringify(error.response.data));
            }
        }
        throw error;
    }
};



/**
 * Obtiene la lista de observaciones disponibles desde el backend.
 * 
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object[]>} - Lista de observaciones.
 * @throws {Error} - Si no se proporciona token o ocurre un error.
 */
export const getObservations = async (token) => {
    if (!token) {
        throw new Error('Token no proporcionado');
    }

    try {
        const response = await axios.get(`${API_URL}auth/get-observations/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Respuesta getObservations:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error en getDepartments:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });
        throw error;
    }
}


/**
 * Obtiene la lista de departamentos disponibles desde el backend.
 * 
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object[]>} - Lista de departamentos.
 * @throws {Error} - Si no se proporciona token o ocurre un error.
 */
export const getDepartments = async (token) => {
    if (!token) {
        throw new Error('Token no proporcionado');
    }
    
    try {
        console.log('URL de la petición:', `${API_URL}core/list-departments`);
        console.log('Headers enviados:', {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        const response = await axios.get(`${API_URL}core/list-departments`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Respuesta del servidor:', response);
        return response.data;
    } catch (error) {
        console.error('Error en getDepartments:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });
        throw error;
    }
}

/**
 * Obtiene estadísticas generales de usuarios desde el backend.
 * 
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object>} - Datos estadísticos.
 * @throws {Error} - Si no se proporciona token o ocurre un error.
 */
export const getUserStats = async(token) => {
    if (!token) {
        throw new Error('Token no proporcionado');
    }
    try {
        console.log('Obteniendo estadisticas de usuarios...');
        const response = await axios.get(`${API_URL}reports/user-stats/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Respuesta :', response.data);
        return response.data;
    } catch (error) {
        console.error('Error en getUsers:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
}

/**
 * Obtiene la lista de usuarios registrados.
 * 
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object[]>} - Lista de usuarios.
 * @throws {Error} - Si no se proporciona token o ocurre un error.
 */
export const getUsers = async (token) => {
    if (!token) {
        throw new Error('Token no proporcionado');
    }
    
    try {
        console.log('Obteniendo lista de usuarios...');
        const response = await axios.get(`${API_URL}auth/list/users/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Respuesta de usuarios:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error en getUsers:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};

/**
 * Actualiza los datos de un usuario existente.
 * 
 * @param {number|string} userId - ID del usuario a actualizar.
 * @param {Object} userData - Datos modificados del usuario.
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object>} - Respuesta del servidor.
 * @throws {Error} - Si ocurre un error durante la solicitud.
 */
export const updateUser = async (userId, userData, token) => {
    try {
        const requestData = {
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            // department_id: parseInt(userData.department),
            // department: parseInt(userData.department),
            dni: userData.dni,
            group: userData.group
        };

        console.log(`Actualizando usuario ID ${userId} con datos:`, JSON.stringify(requestData, null, 2));

        const response = await axios.patch(`${API_URL}auth/edit-user/${userId}/`, requestData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

        });

        return response;
    } catch (error) {
        console.error(`Error actualizando usuario ID ${userId}:`, {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};

/**
 * Elimina un usuario del sistema.
 * 
 * @param {number|string} userId - ID del usuario a eliminar.
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object>} - Respuesta del servidor.
 * @throws {Error} - Si ocurre un error al eliminar.
 */
export const deleteUser = async (userId, token) => {
    try {
        console.log(`Eliminando usuario ID ${userId}...`);
        const response = await axios.delete(`${API_URL}auth/delete-user/${userId}/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response;
    } catch (error) {
        console.error(`Error eliminando usuario ID ${userId}:`, {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};
