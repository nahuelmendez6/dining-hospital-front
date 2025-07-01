// src/components/tickets/TicketCard.jsx
import React from "react";
import ObservationBadge from "./ObservationBadge";

import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as MdIcons from "react-icons/md";

const iconLibraries = { Fa: FaIcons, Gi: GiIcons, Md: MdIcons };

function getIconComponent(iconName) {
  if (!iconName || iconName.length < 2) return null;
  const prefix = iconName.slice(0, 2);
  const lib = iconLibraries[prefix];
  return lib ? lib[iconName] : null;
}

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const TicketCard = ({ ticket }) => {
  return (
    <div className="card shadow-sm border-0 rounded-4 p-3 bg-white h-100">
      <h5 className="text-center mb-2">Ticket de Comedor</h5>

      <div className="ticket-card text-center p-2 rounded-3 bg-warning-subtle border border-warning">
        <div className="small text-warning-emphasis mb-1">Frase clave</div>
        <h5 className="fw-bold m-0">{ticket.words}</h5>
      </div>

      <div className="d-flex justify-content-center my-2">
        <StatusBadge status={ticket.status} />
      </div>

      {ticket.items?.length > 0 && (
        <div className="mt-3">
          <h5 className="text-secondary">Ítems seleccionados:</h5>
          <ul className="list-group list-group-flush">
            {ticket.items.map((item, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{item.name}</span>
                <span className="badge bg-primary rounded-pill">{item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {ticket.observations?.length > 0 && (
        <div className="mt-3">
            <h6 className="text-secondary">Observaciones del Usuario:</h6>
            <div className="d-flex flex-wrap gap-2 mt-2">
            {ticket.observations.map((obs, index) => (
                <ObservationBadge key={index} icon={obs.icon} name={obs.name} />
            ))}
            </div>
        </div>
      )}

      <div className="text-start small mt-3">
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
  );
};

export default TicketCard;

// Subcomponente dentro del mismo archivo (opcionalmente puede ir en su propio archivo)
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { class: "bg-warning", text: "Pendiente" },
    used: { class: "bg-success", text: "Utilizado" },
    expired: { class: "bg-danger", text: "Expirado" },
    cancelled: { class: "bg-secondary", text: "Cancelado" },
  };
  const config = statusConfig[status] || { class: "bg-primary", text: status };
  return <span className={`badge ${config.class} text-white`}>{config.text}</span>;
};
