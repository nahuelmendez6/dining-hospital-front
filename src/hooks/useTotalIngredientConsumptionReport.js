import { useState, useEffect } from 'react';
import { getTotalIngredientConsumptionReport } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';


/**
 * Custom hook para obtener y manejar el reporte de consumo total de ingredientes.
 *
 * Este hook consulta el reporte basado en filtros de fecha proporcionados,
 * maneja estados de carga, error y datos, y permite actualizar filtros.
 *
 * @param {Object} initialFilters - Filtros iniciales que deben incluir al menos
 *                                  las propiedades 'start' y 'end' (fechas).
 * @returns {Object} - Un objeto con:
 *   - data: arreglo con los datos del reporte,
 *   - filters: objeto con los filtros actuales,
 *   - setFilters: función para actualizar los filtros,
 *   - loading: boolean que indica si la consulta está en curso,
 *   - error: mensaje de error si la consulta falla.
 */
const useTotalIngredientConsumptionReport = (initialFilters) => {
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
        const results = await getTotalIngredientConsumptionReport(filters, accessToken);
        setData(results);
      } catch (err) {
        setError('Error al cargar el reporte de consumo total de ingredientes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [filters, accessToken]);

  return { data, filters, setFilters, loading, error };
};

export default useTotalIngredientConsumptionReport;
