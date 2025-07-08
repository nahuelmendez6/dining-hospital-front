import { useState, useEffect } from 'react';
import { getTicketSummary } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';

const useTicketSummary = () => {
  const { accessToken } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!accessToken) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getTicketSummary(accessToken);
        setSummary(data);
      } catch (err) {
        setError('Error al cargar el resumen de tickets.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [accessToken]);

  const cardData = summary ? [
    {
      title: 'Total Tickets',
      value: summary.total_tickets,
      subtitle: 'Total generados este mes',
      bgClass: 'bg-primary'
    },
    {
      title: 'Tickets Pendientes',
      value: summary.pending_tickets,
      subtitle: 'Aún no utilizados',
      bgClass: 'bg-warning'
    },
    {
      title: 'Tickets Usados',
      value: summary.used_tickets,
      subtitle: `${Math.round((summary.used_tickets / summary.total_tickets) * 100)}% de utilización`,
      bgClass: 'bg-success'
    },
    {
      title: 'Usuarios Activos',
      value: summary.active_users,
      subtitle: 'Con actividad reciente',
      bgClass: 'bg-info'
    }
  ] : [];

  return { cardData, loading, error };
};

export default useTicketSummary;
