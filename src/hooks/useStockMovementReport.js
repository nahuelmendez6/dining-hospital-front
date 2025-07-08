import { useState, useEffect } from 'react';
import { fetchStockMovements } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';

const useStockMovementReport = (initialFilters) => {
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
        const results = await fetchStockMovements(filters, accessToken);
        setData(results);
      } catch (err) {
        setError('Error al cargar el reporte de movimientos de stock.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, accessToken]);

  return { data, filters, setFilters, loading, error };
};

export default useStockMovementReport;
