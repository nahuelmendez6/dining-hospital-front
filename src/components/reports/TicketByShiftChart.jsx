import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell
} from 'recharts';

// Función para generar un color HSL distinto según el índice
const getColor = (index) => {
  const hue = (index * 137.508) % 360; // número áureo para buena distribución
  return `hsl(${hue}, 70%, 50%)`;
};

const TicketsByShiftChart = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('2025-06-15');
  const [endDate, setEndDate] = useState('2025-06-22');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (status) params.status = status;

      const response = await axios.get('http://localhost:8000/reports/tickets-by-shift/', {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setData(response.data.results);
    } catch (error) {
      console.error('Error al cargar tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [startDate, endDate, status]);

  return (
    <div className="w-full" style={{ height: 450, display: 'flex', flexDirection: 'column' }}>
      <h2 className="text-xl font-bold mb-4">Tickets por Turno</h2>
  
      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label>Fecha Inicio</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label>Fecha Fin</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label>Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="">Todos</option>
            <option value="pending">Pendiente</option>
            <option value="used">Usado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>
  
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div style={{ flexGrow: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="shift__name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" name="Tickets">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TicketsByShiftChart;
