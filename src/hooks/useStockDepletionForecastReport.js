import { useState, useEffect } from 'react';
import { getStockDepletionForecastReport } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';

const useStockDepletionForecastReport = (initialFilters) => {
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
        const results = await getStockDepletionForecastReport(filters, accessToken);
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

export default useStockDepletionForecastReport;
