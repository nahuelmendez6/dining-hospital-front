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

    useEffect(() => {
        fetchTickets(selectedDate);
    }, [selectedDate, token]); // importante incluir token

    return (
        <Layout>
            <div className="container-fluid p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Gestión de Tickets</h2>
                    <input
                        type="date"
                        className="form-control w-auto"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>

                <div className="card">
                    <div className="card-body table-responsive">
                        <table className="table table-hover">
                            <thead>
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
                                    <tr><td colSpan="7" className="text-center">No hay tickets</td></tr>
                                ) : (
                                    tickets.map((ticket) => (
                                        <tr key={ticket.id}>
                                            <td>{ticket.id}</td>
                                            <td>{ticket.user}</td>
                                            <td>{new Date(ticket.date).toLocaleDateString()}</td>
                                            <td>{ticket.shift}</td>
                                            <td>{ticket.status}</td>
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
