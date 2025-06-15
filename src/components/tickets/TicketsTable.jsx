import React, { useEffect, useState } from 'react';
import Layout from '../Layout';
import { getTickets } from '../../services/ticketService';
import { useAuth } from '../../contexts/AuthContext';
import DateFilter from './DateFilter';
import TicketRow from './TicketRow';
import LoadingRow from './LoadingRow';
import EmptyRow from './EmptyRow';
import TicketSummaryCards from './TicketShitSummaryCards';

import { getTicketCountByShift } from '../../services/reportService';

const TicketsTable = () => {
  const { accessToken: token } = useAuth();
  const [tickets, setTickets] = useState([]);
  // const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);

  const [summary, setSummary] = useState([]);
  
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const fetchTickets = async (date) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await getTickets(token, date);
      const summary_data = await getTicketCountByShift(token, date);
      setTickets(data);
      setSummary(summary_data);
    } catch (error) {
      console.error('Error al obtener tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(selectedDate);
  }, [selectedDate, token]);

  return (
    <Layout>
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0"><i className="bi bi-ticket-detailed me-2"></i>Gestión de Tickets</h2>
          <DateFilter value={selectedDate} onChange={setSelectedDate} />
        </div>

        <TicketSummaryCards summary={summary} />

        <div className="card shadow-sm border-0">
          <div className="card-body table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID Ticket</th>
                  <th>Usuario</th>
                  <th>Fecha</th>
                  <th className="d-none d-md-table-cell">Turno</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <LoadingRow />
                ) : tickets.length === 0 ? (
                  <EmptyRow />
                ) : (
                  tickets.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} />)
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
