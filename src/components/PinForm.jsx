import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateTicket } from '../services/ticketService';

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
    const statusConfig = {
      'pending': { class: 'bg-warning', text: 'Pendiente' },
      'used': { class: 'bg-success', text: 'Utilizado' },
      'expired': { class: 'bg-danger', text: 'Expirado' },
      'cancelled': { class: 'bg-secondary', text: 'Cancelado' }
    };
    const config = statusConfig[status] || { class: 'bg-primary', text: status };
    return <span className={`badge ${config.class} text-white`}>{config.text}</span>;
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="col-12 col-sm-10 col-md-6 col-lg-4">
        <div className="card shadow-lg border-0 rounded-4 p-4">
          {/* <h2 className="text-center mb-4">Acceso con PIN</h2> */}

          {!ticket ? (
            <form onSubmit={handleSubmit}>
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

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Generando ticket...' : 'Generar Ticket'}
              </button>

              {error && (
                <div className="alert alert-danger mt-3">{error}</div>
              )}
            </form>
          ) : (
            <div className="ticket-card text-center">
              <h3 className="mb-3">Ticket de Comedor</h3>
              <div className="mb-3">
                {/* <QRCodeSVG
                  value={ticket.qr_data}
                  size={200}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: "/hospital-logo.png",
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                /> */}
              </div>
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
