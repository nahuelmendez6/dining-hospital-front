import { useState, useEffect } from 'react';
import { getItemConsumptionVsStock } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';

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
