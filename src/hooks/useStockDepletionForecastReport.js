import { useState, useEffect } from 'react';
import { getStockDepletionForecastReport } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';


/**
 * Hook personalizado para obtener y manejar el reporte de pronóstico de agotamiento de stock.
 * 
 * Realiza una consulta al backend con filtros y token de autenticación,
 * y mantiene el estado de datos, carga y posibles errores.
 * 
 * @param {Object} initialFilters - Filtros iniciales para la consulta (por ejemplo, rango de fechas, categorías).
 * @returns {Object} Un objeto con:
 *   - data: arreglo con los resultados del pronóstico de agotamiento de stock,
 *   - filters: objeto con los filtros actuales,
 *   - setFilters: función para actualizar los filtros,
 *   - loading: booleano que indica si la consulta está en curso,
 *   - error: mensaje de error en caso de fallo en la consulta.
 */
const useStockDepletionForecastReport = (initialFilters) => {
  const { accessToken } = useAuth();
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!accessToken) return;

      setLoading(true);
      setError(null);

      try {
        const results = await getStockDepletionForecastReport(filters, accessToken);
        setData(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [filters, accessToken]);

  return { data, filters, setFilters, loading, error };
};

export default useStockDepletionForecastReport;
