// src/pages/TicketsPage.jsx

import React from "react";
import useTicketsWebSocket from "../hooks/useTicketsWebSocket";
import TicketCard from "../components/tickets/TicketCard";

const TicketListPage = () => {
  const { tickets, connected } = useTicketsWebSocket();

  return (
    <div className="container mt-4">
      {!connected && (
        <div className="alert alert-warning text-center">
          🔌 Conectando al WebSocket...
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="text-center mt-5">
          <h5 className="text-muted">🕓 Aún no hay tickets registrados.</h5>
        </div>
      ) : (
        <div className="row g-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="col-12 col-sm-6 col-md-4">
              <TicketCard ticket={ticket} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketListPage;
