import { useState, useEffect } from 'react';
import { getItemConsumptionTrend } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';

const useItemConsumptionTrend = () => {
  const { accessToken } = useAuth();
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const transformData = (rawData) => {
    const groupedByDate = {};

    rawData.forEach(({ date, item, quantity }) => {
      if (!groupedByDate[date]) groupedByDate[date] = { date };
      groupedByDate[date][item] = quantity;
    });

    return Object.values(groupedByDate);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;

      setLoading(true);
      setError(null);

      try {
        const results = await getItemConsumptionTrend(accessToken);
        const transformedResults = results.map(r => ({
          date: r.ticket__date_only,
          item: r.item__name,
          quantity: r.total
        }));

        const uniqueItems = [...new Set(transformedResults.map(r => r.item))];
        setItems(uniqueItems);

        const formattedData = transformData(transformedResults);
        setData(formattedData);
      } catch (err) {
        setError('Error al obtener datos de consumo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  return { data, items, loading, error };
};

export default useItemConsumptionTrend;
