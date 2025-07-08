import { useState, useEffect } from 'react';
import { getObservationsReport } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';

const useObservationsReport = (initialFilters) => {
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
        const results = await getObservationsReport(filters, accessToken);
        const formattedData = results.map(obs => ({
          name: obs.observation__name,
          total: obs.total,
          icon: obs.observation__icon_name
        }));
        setData(formattedData);
      } catch (err) {
        setError('Error al obtener los datos de observaciones.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, accessToken]);

  return { data, filters, setFilters, loading, error };
};

export default useObservationsReport;
