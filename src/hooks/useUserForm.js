import { useState, useEffect } from 'react';
import { getGroups } from '../services/groupService';
import { getObservations } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';


/**
 * Custom hook para manejar la carga y estado de opciones para el formulario de usuario.
 * 
 * Este hook obtiene las opciones de grupos y observaciones desde la API,
 * y controla el estado de carga y posibles errores.
 * 
 * @param {boolean} isOpen - Indica si el formulario/modal está abierto.
 * @returns {object} - Contiene:
 *   - groupOptions: array con las opciones de grupos de usuario,
 *   - observationOptions: array con las observaciones disponibles,
 *   - loading: boolean que indica si está cargando datos,
 *   - error: mensaje de error si la carga falla.
 */
export const useUserForm = (isOpen) => {
    
     // Obtener el token de autenticación desde el contexto global
    const { accessToken: token } = useAuth();
    
    // Estado para las opciones del select de grupos
    const [groupOptions, setGroupOptions] = useState([]);
    
    // Estado para las opciones del select de observaciones
    const [observationOptions, setObservationOptions] = useState([]);
    
    // Estado que indica si la carga está en progreso
    const [loading, setLoading] = useState(false);
    
    // Estado para capturar errores durante la carga
    const [error, setError] = useState(null);

    useEffect(() => {
        
        // Solo buscar datos si el modal está abierto y tenemos un token
        if (!isOpen || !token) {
            return;
        }

        // Función asíncrona para obtener datos de grupos y observaciones
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                
                // Ejecutar ambas peticiones en paralelo para optimizar tiempo
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
    }, [isOpen, token]); // El efecto se vuelve a ejecutar cuando cambian isOpen o token


    // Retorna los estados y datos para que el componente que use este hook pueda utilizarlos
    return { groupOptions, observationOptions, loading, error };
};