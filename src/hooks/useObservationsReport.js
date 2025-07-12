import { useState, useEffect } from 'react';
import { getObservationsReport } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';


/**
 * Hook personalizado para manejar el reporte de observaciones.
 * Realiza la consulta de datos al backend con filtros y token de autenticación.
 * Formatea la data recibida para un uso más amigable en UI.
 * 
 * @param {Object} initialFilters - Filtros iniciales para la consulta (por ejemplo fechas, usuarios, etc).
 * @returns {Object} - {
 *   data: Array de observaciones formateadas,
 *   filters: filtros actuales usados,
 *   setFilters: función para actualizar filtros,
 *   loading: estado de carga,
 *   error: mensaje de error si falla la consulta,
 * }
 */
const useObservationsReport = (initialFilters) => {
  const { accessToken } = useAuth();
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;

      setLoading(true);
      setError(null);

      try {
        const results = await getObservationsReport(filters, accessToken);
        const formattedData = results.map(obs => ({
          name: obs.observation__name,
          total: obs.total,
          icon: obs.observation__icon_name
        }));
        setData(formattedData);
      } catch (err) {
        setError('Error al obtener los datos de observaciones.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, accessToken]);

  return { data, filters, setFilters, loading, error };
};

export default useObservationsReport;
