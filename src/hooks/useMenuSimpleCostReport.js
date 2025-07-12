import { useState, useEffect } from 'react';
import { getMenuSimpleCostReport } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook personalizado para obtener el reporte de costo simple de menú.
 * Realiza una llamada al backend con filtros y token de autenticación.
 * Controla el estado de carga, error y la data recibida.
 * 
 * @param {Object} initialFilters - Filtros iniciales para la consulta (debe incluir al menos `start` y `end`).
 * @returns {Object} - {
 *   data: Array con resultados del reporte,
 *   filters: filtros actuales,
 *   setFilters: función para actualizar filtros,
 *   loading: boolean que indica si está cargando,
 *   error: mensaje de error en caso de fallo,
 * }
 */
const useMenuSimpleCostReport = (initialFilters) => {
  const { accessToken } = useAuth();
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!accessToken || !filters.start || !filters.end) return;

      setLoading(true);
      setError(null);

      try {
        const results = await getMenuSimpleCostReport(filters, accessToken);
        setData(results);
      } catch (err) {
        setError('Error al cargar el reporte de costo simple de menú.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [filters, accessToken]);

  return { data, filters, setFilters, loading, error };
};

export default useMenuSimpleCostReport;
