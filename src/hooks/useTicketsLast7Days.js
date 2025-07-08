import { useState, useEffect } from 'react';
import { getTicketsLast7Days } from '../services/reportsService';

const useTicketsLast7Days = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getTicketsLast7Days();
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return { data, loading, error };
};

export default useTicketsLast7Days;
