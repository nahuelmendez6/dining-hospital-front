import { useState, useEffect } from 'react';
import { getMenuSimpleCostReport } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';

const useMenuSimpleCostReport = (initialFilters) => {
  const { accessToken } = useAuth();
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!accessToken || !filters.start || !filters.end) return;

      setLoading(true);
      setError(null);

      try {
        const results = await getMenuSimpleCostReport(filters, accessToken);
        setData(results);
      } catch (err) {
        setError('Error al cargar el reporte de costo simple de menú.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [filters, accessToken]);

  return { data, filters, setFilters, loading, error };
};

export default useMenuSimpleCostReport;
