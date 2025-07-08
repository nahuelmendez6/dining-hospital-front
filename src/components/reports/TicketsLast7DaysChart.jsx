import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import useTicketsLast7Days from '../../hooks/useTicketsLast7Days';
import './TicketsLast7DaysChart.css';

const TicketsLast7DaysChart = () => {
  const { data, loading, error } = useTicketsLast7Days();

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error al cargar los datos: {error}</p>;

  return (
    <div className="tickets-chart-container">
      <h2 className="tickets-chart-title">Tickets últimos 7 días</h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#4F46E5" name="Total de Tickets" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TicketsLast7DaysChart;
