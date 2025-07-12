import { useState, useEffect } from 'react';
import { getTicketsLast7Days } from '../services/reportsService';

/**
 * Custom hook para obtener los tickets generados en los últimos 7 días.
 *
 * Este hook realiza la consulta al backend cuando el componente se monta,
 * y maneja estados de datos, carga y error.
 *
 * @returns {Object} - Un objeto con:
 *   - data: arreglo con los tickets obtenidos,
 *   - loading: boolean indicando si la consulta está en curso,
 *   - error: mensaje de error si la consulta falla.
 */
const useTicketsLast7Days = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getTicketsLast7Days();
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return { data, loading, error };
};

export default useTicketsLast7Days;
