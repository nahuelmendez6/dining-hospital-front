import { useState, useEffect } from 'react';
import { getGroups } from '../services/groupService';
import { getObservations } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

export const useUserForm = (isOpen) => {
    const { accessToken: token } = useAuth();
    const [groupOptions, setGroupOptions] = useState([]);
    const [observationOptions, setObservationOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Solo buscar datos si el modal está abierto y tenemos un token
        if (!isOpen || !token) {
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Hacemos las dos llamadas a la API en paralelo para mayor eficiencia
                const [groupsData, observationsData] = await Promise.all([
                    getGroups(token),
                    getObservations(token)
                ]);
                setGroupOptions(groupsData);
                setObservationOptions(observationsData);
            } catch (err) {
                console.error("Error al cargar datos del formulario", err);
                setError("No se pudieron cargar las opciones del formulario.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isOpen, token]); // Dependencias del efecto

    return { groupOptions, observationOptions, loading, error };
};