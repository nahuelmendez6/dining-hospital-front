import { useState, useEffect } from 'react';
import { getItemConsumptionVsStock } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';


/**
 * Hook para obtener y gestionar datos del consumo de ítems en comparación con el stock disponible.
 * 
 * @param {Object} initialFilters - Filtros iniciales para la consulta (por ejemplo, rango de fechas).
 * @returns {Object} {
 *   data: Array con objetos que contienen nombre del ítem, cantidad consumida y stock actual,
 *   filters: Objeto con filtros actuales,
 *   setFilters: Función para actualizar los filtros,
 *   loading: Booleano que indica si la carga está en proceso,
 *   error: Mensaje de error, si ocurrió alguno,
 * }
 */
const useItemConsumptionVsStock = (initialFilters) => {
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
        const results = await getItemConsumptionVsStock(filters, accessToken);
        const formattedData = results.map(item => ({
          name: item.item__name,
          consumed: item.total_consumed,
          stock: item.item__stock,
        }));
        setData(formattedData);
      } catch (err) {
        setError('Error al obtener los datos de consumo vs stock.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, accessToken]);

  return { data, filters, setFilters, loading, error };
};

export default useItemConsumptionVsStock;
