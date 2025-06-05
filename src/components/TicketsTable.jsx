import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getTickets } from '../services/ticketService';
import { useAuth } from '../contexts/AuthContext';

const TicketsTable = () => {
    const { accessToken: token } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });

    const fetchTickets = async (date) => {
        try {
            if (!token) return; // Esperar a que esté disponible
            const data = await getTickets(token, date);
            setTickets(data);
        } catch (error) {
            console.error('Error al obtener los tickets:', error);
        }
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-success';
            case 'aprobado':
                return 'bg-primary'; // Puedes cambiar este color si deseas diferenciarlo más.
            case 'rechazado':
                return 'bg-danger';
            case 'cancelado':
                return 'bg-secondary';
            default:
                return 'bg-light text-dark';
        }
    };
    
    

    useEffect(() => {
        fetchTickets(selectedDate);
    }, [selectedDate, token]); // importante incluir token

    return (
        <Layout>
            <div className="container-fluid p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">
                        <i className="bi bi-ticket-detailed me-2"></i>Gestión de Tickets
                    </h2>
                    <input
                        type="date"
                        className="form-control w-auto shadow-sm"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>

                <div className="card shadow-sm border-0">
                    <div className="card-body table-responsive">
                        <table className="table table-hover table-striped align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID Ticket</th>
                                    <th>Usuario</th>
                                    <th>Fecha</th>
                                    <th>Turno</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted py-4">
                                            <i className="bi bi-exclamation-circle me-2"></i>No hay tickets
                                        </td>
                                    </tr>
                                ) : (
                                    tickets.map((ticket) => (
                                        <tr key={ticket.id}>
                                            <td>{ticket.id}</td>
                                            <td>{ticket.user}</td>
                                            <td>{new Date(ticket.date).toLocaleDateString()}</td>
                                            <td>{ticket.shift}</td>
                                            <td>
                                                <span className={`badge px-3 py-2 rounded-pill ${getStatusClass(ticket.status)}`}>
                                                    {ticket.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </Layout>
    );
};

export default TicketsTable;
