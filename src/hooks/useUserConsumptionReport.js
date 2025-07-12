import { useState, useEffect } from 'react';
import { getUserConsumptionReport } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';


/**
 * Custom hook para obtener y gestionar el reporte de consumo de usuarios.
 * 
 * Este hook maneja la obtención de datos según filtros proporcionados,
 * controla estados de carga y error, y expone funciones para modificar filtros.
 * 
 * @param {Object} initialFilters - Filtros iniciales para la consulta del reporte.
 * @returns {Object} - Un objeto con:
 *   - data: arreglo con los datos del reporte,
 *   - filters: objeto con los filtros actuales,
 *   - setFilters: función para actualizar los filtros,
 *   - loading: boolean que indica si está cargando los datos,
 *   - error: mensaje de error si la consulta falla.
 */
const useUserConsumptionReport = (initialFilters) => {
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
        const results = await getUserConsumptionReport(filters, accessToken);
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

export default useUserConsumptionReport;
