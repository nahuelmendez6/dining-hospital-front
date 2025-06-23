import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';

const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const TicketsByShiftReport = () => {
  const [startDate, setStartDate] = useState(formatDate(new Date())); // hoy
  const [endDate, setEndDate] = useState(formatDate(new Date()));     // hoy
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/reports/tickets-by-shift/', {
        params: { start_date: startDate, end_date: endDate }
      });
  
      const rawData = res.data?.data || [];
  
      const groupedData = rawData.reduce((acc, { shift_name, status, count }) => {
        let entry = acc.find(e => e.shift === shift_name);
        if (!entry) {
          entry = { shift: shift_name, pending: 0, used: 0, cancelled: 0 };
          acc.push(entry);
        }
        entry[status] = count;
        return acc;
      }, []);
  
      setData(groupedData);
    } catch (error) {
      console.error("Error cargando reporte:", error);
    }
    setLoading(false);
  };
  
  

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  return (
    <div className="p-4 w-full h-[400px]">
      <h2 className="text-xl font-semibold mb-4">Tickets por turno y estado</h2>

      <div className="flex gap-4 mb-6 items-center">
        <label>
          Fecha inicio:
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="ml-2 p-1 border rounded"
            max={endDate}
          />
        </label>
        <label>
          Fecha fin:
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="ml-2 p-1 border rounded"
            min={startDate}
          />
        </label>
        <button
          onClick={fetchReport}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
        >
          {loading ? "Cargando..." : "Actualizar"}
        </button>
      </div>
      <div style={{ width: 600, height: 400, padding: 16 }}>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="shift" />
            <YAxis allowDecimals={false} />
            <CartesianGrid stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Bar dataKey="pending" stackId="a" fill="#facc15" name="Pendientes" />
            <Bar dataKey="used" stackId="a" fill="#22c55e" name="Usados" />
            {/* barra cancelada eliminada */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TicketsByShiftReport;
