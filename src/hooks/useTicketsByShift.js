import { useState, useEffect } from 'react';
import { getTicketsByShift } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';

const useTicketsByShift = (initialFilters) => {
  const { accessToken } = useAuth();
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!accessToken) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getTicketsByShift(filters, accessToken);
        setData(response);
      } catch (err) {
        setError('Error al cargar los tickets por turno.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [filters, accessToken]);

  return { data, filters, setFilters, loading, error };
};

export default useTicketsByShift;
