import { useState, useEffect } from 'react';
import { getDepartments, getUsers, createUser, updateUser } from '../services/userSerive';
import { useAuth } from '../contexts/AuthContext';

export const useUsers = () => {

    const { accessToken } = useAuth();

    // state users para guardar la lista de usuarios obtenida de la API
    const [users, setUsers] = useState([]);

    // state para guardar los departamentos obtenidos desde la API
    const [departments, setDepartments] = useState([]);

    // state para saber si se esta cargando info. Se puede usar con un spinner o desactivar botones
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {

        // funcion asincrona para cargar datos desde la API

        if (!accessToken) return;

        try {
            const departmentsData = await getDepartments(accessToken);
            const usersData = await getUsers(accessToken);
            setDepartments(departmentsData.departments || departmentsData || []);
            setUsers(usersData);
        } catch (error) {
            console.error('Error al cagar datos:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchData();
    }, [accessToken]);

    const saveUser = async (data, editing = false, userId = null) => {
        if (editing && userId) {
            await updateUser(accessToken, userId, data);
        } else {
            await createUser(data, accessToken);
        }
        await fetchData();
    };

    return {
        users,
        departments,
        loading,
        saveUser,
    };
};