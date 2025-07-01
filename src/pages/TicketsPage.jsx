// src/pages/TicketsPage.jsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { getTickets } from "../services/ticketService";
import { getTicketCountByShift } from "../services/reportService";

import DateFilter from "../components/tickets/DateFilter";
import TicketRow from "../components/tickets/TicketRow";
import LoadingRow from "../components/tickets/LoadingRow";
import EmptyRow from "../components/tickets/EmptyRow";
import TicketSummaryCards from "../components/tickets/TicketShitSummaryCards";

function TicketsPage() {
  const { accessToken: token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [summary, setSummary] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const ticketData = await getTickets(token, selectedDate);
        const summaryData = await getTicketCountByShift(token, selectedDate);
        setTickets(ticketData);
        setSummary(summaryData);
      } catch (error) {
        console.error("Error al obtener tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [selectedDate, token]);

  return (
    <Layout>
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">
            <i className="bi bi-ticket-detailed me-2"></i>Gestión de Tickets
          </h2>
          <DateFilter value={selectedDate} onChange={setSelectedDate} />
        </div>

        <TicketSummaryCards summary={summary} />

        <div className="card shadow-sm border-0">
          <div className="card-body table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  {/* <th>ID Ticket</th> */}
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
                  tickets.map((ticket) => (
                    <TicketRow key={ticket.id} ticket={ticket} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default TicketsPage;
