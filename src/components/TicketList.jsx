import React, { useEffect, useState } from "react";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/tickets/");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Nuevo ticket recibido:", data);
      setTickets((prev) => [data.ticket, ...prev]);
    };

    socket.onopen = () => {
      console.log("Conectado al WebSocket");
    };

    socket.onclose = () => {
      console.log("Desconectado del WebSocket");
    };

    return () => socket.close();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: "bg-warning", text: "Pendiente" },
      used: { class: "bg-success", text: "Utilizado" },
      expired: { class: "bg-danger", text: "Expirado" },
      cancelled: { class: "bg-secondary", text: "Cancelado" },
    };
    const config = statusConfig[status] || { class: "bg-primary", text: status };
    return (
      <span className={`badge ${config.class} text-white`}>{config.text}</span>
    );
  };

  return (
    <div className="container mt-4">
      <div className="row g-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="col-12 col-sm-6 col-md-4">
            <div className="card shadow-sm border-0 rounded-4 p-3 bg-white h-100">
              <h5 className="text-center mb-2">Ticket de Comedor</h5>

              <div className="ticket-card text-center p-2 rounded-3 bg-warning-subtle border border-warning">
                <div className="small text-warning-emphasis mb-1">Frase clave</div>
                <h5 className="fw-bold m-0">{ticket.words}</h5>
              </div>

              <div className="d-flex justify-content-center my-2">
                {getStatusBadge(ticket.status)}
              </div>

              {ticket.items && ticket.items.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-secondary">Ítems seleccionados:</h5>
                  <ul className="list-group list-group-flush">
                    {ticket.items.map((item, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{item.name}</span>
                        <span className="badge bg-primary rounded-pill">{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}


              <div className="text-start small">
                <p className="mb-1">
                  <strong>Nombre:</strong> {ticket.user}
                </p>
                <p className="mb-1">
                  <strong>Turno:</strong> {ticket.shift}
                </p>
                <p className="mb-1">
                  <strong>Fecha:</strong> {new Date(ticket.date).toLocaleDateString()}
                </p>
                <p className="mb-1">
                  <strong>Hora:</strong> {formatTime(ticket.date)}
                </p>
              </div>


            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketList;
