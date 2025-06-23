import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';

const TicketsLast7DaysChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:8000/reports/tickets-last-7-days/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}` // Cambiá si no usás JWT
          }
        });
        console.log('Datos recibidos:', response.data);
        setData(response.data); // Los objetos tienen { date, count }
      } catch (error) {
        console.error('Error al obtener datos de tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <p>Cargando datos...</p>;

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h2 style={{ marginBottom: '1rem' }}>Tickets últimos 7 días</h2>
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
