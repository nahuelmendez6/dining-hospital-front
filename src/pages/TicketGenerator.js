import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateTicket } from '../services/ticketService';

const TicketGenerator = () => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ticket, setTicket] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTicket(null);

    // Validación básica del PIN
    if (!pin.match(/^\d{4}$/)) {
      setError('El PIN debe ser un número de 4 dígitos');
      setLoading(false);
      return;
    }

    try {
      const ticketData = await generateTicket(pin);
      setTicket(ticketData);
      setPin(''); // Limpiar el PIN después de generar el ticket
    } catch (error) {
      console.error('Error al generar ticket:', error);
      setError(error.message);
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
      hour12: true 
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
    return (
      <span className={`badge ${config.class} text-white`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="container">
      <div className="row justify-content-center min-vh-100 align-items-center">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h1 className="text-center mb-4">Comedor Hospitalario</h1>
              
              {!ticket ? (
                <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                  <div className="mb-3">
                    <label htmlFor="pin" className="form-label">PIN</label>
                    <input
                      type="password"
                      className={`form-control form-control-lg ${error ? 'is-invalid' : ''}`}
                      id="pin"
                      value={pin}
                      onChange={(e) => {
                        setPin(e.target.value);
                        setError(null); // Limpiar error al escribir
                      }}
                      placeholder="Ingrese su PIN"
                      required
                      pattern="\d{4}"
                      maxLength="4"
                      minLength="4"
                      autoFocus
                    />
                    <div className="form-text text-center mt-2">
                      Ingrese su PIN de 4 dígitos
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Generando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-ticket-perforated me-2"></i>
                        Generar Ticket
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="ticket-card">
                  <div className="text-center mb-4">
                    <h2 className="mb-3">Ticket de Comedor</h2>
                    <div className="ticket-qr mb-3 d-flex justify-content-center">
                      <div className="qr-container p-2 bg-white rounded shadow-sm">
                        <QRCodeSVG
                          value={ticket.qr_data}
                          size={200}
                          level="H"
                          includeMargin={true}
                          imageSettings={{
                            src: "/hospital-logo.png", // Opcional: logo en el centro del QR
                            height: 40,
                            width: 40,
                            excavate: true,
                          }}
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>

                  <div className="ticket-info">
                    <div className="row mb-2">
                      <div className="col-4 fw-bold">Nombre:</div>
                      <div className="col-8">{ticket.user}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold">Turno:</div>
                      <div className="col-8">{ticket.shift}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold">Fecha:</div>
                      <div className="col-8">{new Date(ticket.date).toLocaleDateString()}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold">Hora:</div>
                      <div className="col-8">{formatTime(ticket.date)}</div>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-muted mb-0">
                      <i className="bi bi-info-circle me-2"></i>
                      Muestre este código al personal de cocina
                    </p>
                  </div>

                  <button 
                    className="btn btn-outline-primary w-100 mt-4"
                    onClick={() => setTicket(null)}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Generar Nuevo Ticket
                  </button>
                </div>
              )}

              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketGenerator; 