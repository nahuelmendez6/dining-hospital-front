import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateTicket } from '../services/ticketService';

import {
  FaCoffee,
  FaMugHot,
  FaGlassWhiskey,
  FaCheese,
  FaEgg,
  FaBreadSlice,
  FaAppleAlt,
  FaLemon,
  FaIceCream,
  FaWineGlass,
  FaCookie,
  FaUtensils,
  FaQuestion,
} from "react-icons/fa";

const iconMap = {
  FaCoffee,
  FaMugHot,
  FaGlassWhiskey,
  FaCheese,
  FaEgg,
  FaBreadSlice,
  FaAppleAlt,
  FaLemon,
  FaIceCream,
  FaWineGlass,
  FaCookie,
  FaUtensils,
};

// import { FaCoffee, FaMugHot, FaGlassWhiskey, FaBreadSlice, FaCheese } from "react-icons/fa";


// const iconMap = {
//   cafe: <FaCoffee />,        // Icono de café
//   te: <FaMugHot />,          // Icono de taza caliente (para té)
//   leche: <FaGlassWhiskey />, // Usamos un vaso para representar leche (no hay icono específico leche)
//   tostadas: <FaBreadSlice />,// Icono de pan (para tostadas)
//   queso: <FaCheese />,       // Icono de queso
// };

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
      <div className="col-12 col-sm-10 col-md-6 col-lg-5">
        <div className="card shadow-lg border-0 rounded-4 p-4">
          {!ticket ? (
            <>
              <h2 className="text-center mb-4">Generar ticket</h2>
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="pin" className="form-label">PIN</label>
                  <input
                    type="text"
                    id="pin"
                    className="form-control text-center fs-4"
                    value={pin}
                    onChange={handlePinChange}
                    inputMode="numeric"
                    maxLength="6"
                    required
                    style={{ letterSpacing: '0.5em' }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label d-block">Seleccione los ítems</label>
                  <div className="d-flex flex-wrap gap-3 justify-content-start">
                    {menuItems.map(item => {
                      console.log("Item icon_name:", item.icon_name, "Keys in iconMap:", Object.keys(iconMap));

                      console.log("Nombre:", item.name, "Ícono:", item.icon_name, "¿Existe?", iconMap[item.icon_name]);
                      const Icon = iconMap[item.icon_name] || FaQuestion; 
                      const isSelected = selectedItems.includes(item.id);

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleItemChange(item.id)}
                          className={`border rounded-3 text-center p-3 cursor-pointer ${
                            isSelected ? 'bg-primary text-white' : 'bg-light'
                          }`}
                          style={{
                            width: 90,
                            height: 90,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: '0.3s',
                          }}
                        >
                          <div style={{ fontSize: 24 }}><Icon /></div>
                          <small>{item.name}</small>
                        </div>
                      );
                    })}
                  </div>
                </div>


                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Generando ticket...
                    </>
                  ) : (
                    'Generar Ticket'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="ticket-card text-center">
              <h3 className="mb-3">Ticket de Comedor</h3>

              {/* QR opcional */}
              {/* <QRCodeSVG value={ticket.qr_data} size={200} /> */}

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

              <button className="btn btn-outline-primary mt-4 w-100" onClick={() => setTicket(null)}>
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

export default MenuTicketForm;
