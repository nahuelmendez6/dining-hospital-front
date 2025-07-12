import { useState, useEffect } from 'react';
import { fetchStockMovements } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook para obtener y manejar el reporte de movimientos de stock.
 *
 * Realiza la consulta al backend con filtros específicos y token de autenticación,
 * y mantiene estados de datos, carga y error.
 *
 * @param {Object} initialFilters - Filtros iniciales para la consulta (ej. rango de fechas, tipo de movimiento).
 * @returns {Object} - Un objeto con:
 *   - data: arreglo con los movimientos de stock obtenidos,
 *   - filters: objeto con filtros actuales,
 *   - setFilters: función para actualizar los filtros,
 *   - loading: boolean que indica si la consulta está en curso,
 *   - error: mensaje de error si la consulta falla.
 */
const useStockMovementReport = (initialFilters) => {
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
        const results = await fetchStockMovements(filters, accessToken);
        setData(results);
      } catch (err) {
        setError('Error al cargar el reporte de movimientos de stock.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, accessToken]);

  return { data, filters, setFilters, loading, error };
};

export default useStockMovementReport;
