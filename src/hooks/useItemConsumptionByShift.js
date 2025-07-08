import { useState, useEffect } from 'react';
import { getItemConsumptionByShift } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';

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
