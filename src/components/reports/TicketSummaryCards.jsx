import React from 'react';
import useTicketSummary from '../../hooks/useTicketSummary';

const TicketSummaryCards = () => {
  const { cardData, loading, error } = useTicketSummary();

  if (loading) {
    return <p>Cargando resumen...</p>;
  }

  if (error) {
    return <p>{error}</p>;
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
