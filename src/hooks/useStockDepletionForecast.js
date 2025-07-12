import { useState, useEffect } from 'react';
import { getStockDepletionForecast } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';

/**
 * Genera una lista de colores HSL para diferenciar visualmente elementos,
 * distribuídos uniformemente en el espectro de colores.
 * 
 * @param {number} count - Cantidad de colores a generar.
 * @returns {string[]} Array de strings con colores HSL.
 */
const generateColors = (count) => {
  const colors = [];
  const hueStep = 360 / count;
  for (let i = 0; i < count; i++) {
    colors.push(`hsl(${i * hueStep}, 70%, 50%)`);
  }
  return colors;
};


/**
 * Hook personalizado para obtener y manejar el reporte de pronóstico de agotamiento de stock.
 * 
 * Realiza una consulta al backend con filtros y token de autenticación,
 * y mantiene el estado de datos, colores para visualización, carga y posibles errores.
 * 
 * @param {Object} initialFilters - Filtros iniciales para la consulta (ejemplo: rango de fechas, categorías).
 * @returns {Object} Un objeto con:
 *   - data: arreglo con los resultados del pronóstico de agotamiento,
 *   - colors: arreglo de colores HSL generados para representar cada resultado,
 *   - filters: objeto con los filtros actuales,
 *   - setFilters: función para actualizar los filtros,
 *   - loading: booleano que indica si la consulta está en curso,
 *   - error: mensaje de error en caso de fallo en la consulta.
 */
const useStockDepletionForecast = (initialFilters) => {
  const { accessToken } = useAuth();
  const [data, setData] = useState([]);
  const [colors, setColors] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!accessToken) return;

      setLoading(true);
      setError(null);

      try {
        const results = await getStockDepletionForecast(filters, accessToken);
        setData(results);
        setColors(generateColors(results.length));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [filters, accessToken]);

  return { data, colors, filters, setFilters, loading, error };
};

export default useStockDepletionForecast;
