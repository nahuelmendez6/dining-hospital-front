import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TicketSummaryCards = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/reports/summary/')
      .then(res => setSummary(res.data))
      .catch(err => console.error(err));
  }, []);

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

  if (!summary) {
    return <p>Cargando resumen...</p>;
  }

  return (
    <div className="container">
      <h2 className="my-4">Resumen del sistema</h2>
      <div className="row g-4 mb-4">
        {cardData.map(({ title, value, subtitle, bgClass }, idx) => (
          <div key={idx} className="col-md-3">
            <div className={`card text-white ${bgClass}`}>
              <div className="card-body">
                <h6 className="card-title">{title}</h6>
                <h2 className="card-text">{value}</h2>
                <small>{subtitle}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketSummaryCards;
