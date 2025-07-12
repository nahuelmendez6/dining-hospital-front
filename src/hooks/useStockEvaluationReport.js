import { useState, useEffect } from 'react';
import { getStockEvaluationReport } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';



/**
 * Custom hook para obtener y manejar el reporte de evaluación de stock.
 *
 * Ejecuta una consulta al backend con filtros y token de autenticación,
 * y gestiona estados de datos, carga y error.
 *
 * @param {Object} initialFilters - Filtros iniciales para la consulta (por ejemplo, fechas, categorías).
 * @returns {Object} - Un objeto con:
 *   - data: arreglo con los resultados del reporte de evaluación de stock,
 *   - filters: objeto con filtros actuales,
 *   - setFilters: función para actualizar los filtros,
 *   - loading: boolean que indica si la consulta está en curso,
 *   - error: mensaje de error si la consulta falla.
 */
const useStockEvaluationReport = (initialFilters) => {
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
        const results = await getStockEvaluationReport(filters, accessToken);
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

export default useStockEvaluationReport;
