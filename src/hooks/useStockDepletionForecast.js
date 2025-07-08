import { useState, useEffect } from 'react';
import { getStockDepletionForecast } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';

const generateColors = (count) => {
  const colors = [];
  const hueStep = 360 / count;
  for (let i = 0; i < count; i++) {
    colors.push(`hsl(${i * hueStep}, 70%, 50%)`);
  }
  return colors;
};

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
