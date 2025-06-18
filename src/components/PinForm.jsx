// PinForm.jsx
import React, { useState } from 'react';
import { generateTicket } from '../services/ticketService';
import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as MdIcons from "react-icons/md";

const iconLibraries = {
  Fa: FaIcons,
  Gi: GiIcons,
  Md: MdIcons,
};

function getIconComponent(iconName) {
  if (!iconName || iconName.length < 2) return null;
  const prefix = iconName.slice(0, 2); // Fa, Gi, Md
  const lib = iconLibraries[prefix];
  return lib ? lib[iconName] : null;
}

const PinForm = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTicket(null);

    if (!/^\d{4}$/.test(pin)) {
      setError('El PIN debe ser un número de 4 dígitos');
      setLoading(false);
      return;
    }

    try {
      const ticketData = await generateTicket(pin);
      console.log("Ticket recibido: ", ticketData);
      setTicket(ticketData);
      setPin('');
    } catch (error) {
      setError(error.message || 'Error al generar el ticket');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: 'bg-warning', text: 'Pendiente' },
      used: { class: 'bg-success', text: 'Utilizado' },
      expired: { class: 'bg-danger', text: 'Expirado' },
      cancelled: { class: 'bg-secondary', text: 'Cancelado' },
    };
    const config = statusMap[status] || { class: 'bg-primary', text: status };
    return <span className={`badge ${config.class} text-white`}>{config.text}</span>;
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="col-12 col-sm-10 col-md-6 col-lg-4">
        <div className="card shadow-lg border-0 rounded-4 p-4">
          {!ticket ? (
            <form onSubmit={handleSubmit}>
              <h2 className="text-center mb-4">Generar ticket</h2>
              <div className="mb-3">
                <label htmlFor="pin" className="form-label">Ingrese su PIN</label>
                <input
                  type="password"
                  className={`form-control text-center fs-4 ${error ? 'is-invalid' : ''}`}
                  id="pin"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError('');
                  }}
                  maxLength="4"
                  pattern="\d{4}"
                  inputMode="numeric"
                  required
                  style={{ letterSpacing: '0.5em' }}
                  autoFocus
                />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Generando ticket...' : 'Generar Ticket'}
              </button>

              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
          ) : (
            <div className="ticket-card text-center">
              <h3 className="mb-3">Ticket de Comedor</h3>

              <div className="ticket-card text-center mt-4 p-3 rounded-4 bg-warning-subtle border border-warning shadow-sm">
                <h5 className="mb-2 text-warning-emphasis">Tu frase clave es</h5>
                <h2 className="fw-bold">{ticket.words}</h2>
              </div>

              {getStatusBadge(ticket.status)}
              <div className="text-start mt-4">
                <p><strong>Nombre:</strong> {ticket.user}</p>
                <p><strong>Turno:</strong> {ticket.shift}</p>
                <p><strong>Fecha:</strong> {new Date(ticket.date).toLocaleDateString()}</p>
                <p><strong>Hora:</strong> {formatTime(ticket.date)}</p>
              </div>

              {ticket.observations && ticket.observations.length > 0 && (
                <div className="mt-3 text-start">
                  <h6 className="text-secondary">Observaciones del Usuario:</h6>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {ticket.observations.map((obs, index) => {
                      const IconComponent = getIconComponent(obs.icon);
                      return (
                        <span
                          key={index}
                          className="badge rounded-pill bg-info-subtle text-info-emphasis d-flex align-items-center gap-2 px-3 py-2"
                        >
                          {IconComponent ? <IconComponent /> : <i className="bi bi-exclamation-triangle"></i>}
                          {obs.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="text-muted mt-3">
                <i className="bi bi-info-circle me-2"></i>
                Muestre este código al personal de cocina
              </div>
              <button
                className="btn btn-outline-primary mt-4 w-100"
                onClick={() => setTicket(null)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Generar Nuevo Ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PinForm;
