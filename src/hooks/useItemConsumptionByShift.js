import { useState, useEffect } from 'react';
import { getItemConsumptionByShift } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';


/**
 * Hook para obtener y formatear el consumo de ítems agrupado por turno.
 *
 * @param {Object} initialFilters - Filtros iniciales para la consulta (ejemplo: fecha, turno, etc.)
 * 
 * @returns {Object} {
 *   data: Array de objetos con consumo por turno y cantidades por ítem,
 *   items: Array con los nombres únicos de los ítems consumidos,
 *   filters: Estado actual de filtros,
 *   setFilters: Función para actualizar los filtros,
 *   loading: Booleano que indica si está cargando,
 *   error: Mensaje de error en caso de fallo,
 * }
 *
 * La estructura `data` es un arreglo donde cada objeto representa un turno,
 * y contiene propiedades con el nombre del ítem y su cantidad consumida.
 */
const useItemConsumptionByShift = (initialFilters) => {
  const { accessToken } = useAuth();
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;

      setLoading(true);
      setError(null);

      try {
        const rawResults = await getItemConsumptionByShift(filters, accessToken);
        const allItems = new Set();
        const formatted = Object.entries(rawResults).map(([shift, itemList]) => {
          const entry = { shift };
          itemList.forEach(({ item, quantity }) => {
            entry[item] = quantity;
            allItems.add(item);
          });
          return entry;
        });

        setItems(Array.from(allItems));
        setData(formatted);
      } catch (err) {
        setError('Error al obtener datos de consumo por turno.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, accessToken]);

  return { data, items, filters, setFilters, loading, error };
};

export default useItemConsumptionByShift;
