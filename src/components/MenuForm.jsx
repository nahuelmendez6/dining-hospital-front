import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateTicket } from '../services/ticketService';

import '../MenuTicketForm.css';


import { foodIcons } from '../icons/foodIcons';

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

const MenuTicketForm = ({ menuItems }) => {
  const [pin, setPin] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);

  const handlePinChange = (e) => {
    const value = e.target.value;
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setPin(value);
    }
  };

  const handleItemChange = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTicket(null);

    if (!pin || selectedItems.length === 0) {
      setError('Debes ingresar un PIN y seleccionar al menos un ítem.');
      setLoading(false);
      return;
    }

    try {
      const ticketData = await generateTicket(pin, selectedItems);
      setTicket(ticketData);
      setPin('');
      setSelectedItems([]);
    } catch (err) {
      setError(err.message || 'Error al generar el ticket.');
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

  const formatDateTime = (dateString) => {
    if (!dateString) return { fecha: 'Fecha inválida', hora: 'Hora inválida' };

    // Asegura el formato ISO reemplazando espacio con 'T'
    const isoString = dateString.replace(' ', 'T');
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
      return { fecha: 'Fecha inválida', hora: 'Hora inválida' };
    }

    const fecha = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const hora = date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    return { fecha, hora };
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
    <div className="container d-flex align-items-center justify-content-center min-vh-100 px-3">
  <div className="w-100" style={{ maxWidth: 480 }}>
    <div className="card shadow border-0 rounded-4 p-4 bg-white">
      {!ticket ? (
        <>
          <h2 className="text-center fw-bold mb-4">🎟️ Generar Ticket</h2>
          {/* <h3 className="text-center fw-bold mb-4">{shift}</h3> */}
          {error && <div className="alert alert-danger text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="d-grid gap-4">
            <div>
              <label htmlFor="pin" className="form-label fw-semibold">PIN</label>
              <input
                type="text"
                id="pin"
                className="form-control form-control-lg text-center"
                value={pin}
                onChange={handlePinChange}
                inputMode="numeric"
                maxLength="6"
                required
                placeholder="••••"
                style={{
                  letterSpacing: '0.5em',
                  fontSize: '1.5rem',
                  borderRadius: '0.75rem'
                }}
              />
            </div>

            <div>
              <label className="form-label fw-semibold">Selecciona tus ítems</label>
              <div className="d-flex flex-wrap gap-3 justify-content-start">
                {menuItems.map(item => {
                  const Icon = foodIcons[item.icon_name] || foodIcons.FaQuestion;
                  const isSelected = selectedItems.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemChange(item.id)}
                      className={`selectable-item shadow-sm ${isSelected ? 'active' : ''}`}
                    >
                      <div className="icon"><Icon /></div>
                      <small className="text-center">{item.name}</small>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg rounded-pill fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Generando...
                </>
              ) : (
                'Generar Ticket'
              )}
            </button>
          </form>
        </>
      ) : (
        (() => {
          console.log('ticket.date:', ticket.date);
          const { fecha, hora } = formatDateTime(ticket.date);
          
          return (
            <div className="ticket-success text-center">
              <h3 className="fw-bold mb-3">Ticket Generado</h3>
      
              <div className="bg-warning-subtle p-3 rounded-4 border border-warning mb-3">
                <h6 className="text-warning-emphasis">Tu frase clave es:</h6>
                <h2 className="fw-bold">{ticket.words}</h2>
              </div>
      
              {getStatusBadge(ticket.status)}
      
              <div className="text-start mt-3">
                <p style={{ fontSize: '1.1rem' }}><strong>Nombre:</strong> {ticket.user}</p>
                <p style={{ fontSize: '1.1rem' }}><strong>Turno:</strong> {ticket.shift}</p>
                <p style={{ fontSize: '1.1rem' }}><strong>Fecha:</strong> {fecha}</p>
                <p style={{ fontSize: '1.1rem' }}><strong>Hora:</strong> {hora}</p>
              </div>
      
              {ticket.items && ticket.items.length > 0 && (
                <div className="mt-3 text-start">
                  <h6 className="text-secondary">Ítems seleccionados:</h6>
                  <ul className="list-group list-group-flush">
                    {ticket.items.map((item, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span>{item.name}</span>
                        <span className="badge bg-primary rounded-pill">
                          {item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
      
              <button className="btn btn-outline-primary mt-4 w-100" onClick={() => setTicket(null)}>
                <i className="bi bi-plus-circle me-2"></i>
                Generar Nuevo Ticket
              </button>
            </div>
          );
        })()
        
      )}
    </div>
  </div>
</div>

  );
};

export default MenuTicketForm;
