import axios from 'axios';

const API_URL = 'http://localhost:8000/';

// funcion para crear usuario
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


// funcion para obtener observaciones
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



// funcion para obtener departamentos
/** */
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

// funcion para obtener estadisticas de usuarios
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

// funcion para obtener usuarios
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

// funcion para actualizar un usuario existente
export const updateUser = async (userId, userData, token) => {
    try {
        const requestData = {
            first_name: userData.first_namename,
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

// funcion para eliminar un usuario
export const deleteUser = async (userId, token) => {
    try {
        console.log(`Eliminando usuario ID ${userId}...`);
        const response = await axios.delete(`${API_URL}auth/delete/user/${userId}/`, {
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
