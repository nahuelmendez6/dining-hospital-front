import { useState, useEffect } from 'react';
import { getTicketsByShift } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook para obtener tickets filtrados por turno.
 *
 * Realiza una consulta al backend con filtros específicos y el token de autenticación,
 * actualizando los datos cuando los filtros o el token cambian.
 *
 * @param {Object} initialFilters - Filtros iniciales para la consulta (ej. fecha, turno).
 * @returns {Object} - Un objeto con:
 *   - data: arreglo con los tickets filtrados por turno,
 *   - filters: objeto con filtros actuales,
 *   - setFilters: función para actualizar los filtros,
 *   - loading: boolean que indica si la consulta está en curso,
 *   - error: mensaje de error si la consulta falla.
 */
const useTicketsByShift = (initialFilters) => {
  const { accessToken } = useAuth();
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!accessToken) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getTicketsByShift(filters, accessToken);
        setData(response);
      } catch (err) {
        setError('Error al cargar los tickets por turno.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [filters, accessToken]);

  return { data, filters, setFilters, loading, error };
};

export default useTicketsByShift;
