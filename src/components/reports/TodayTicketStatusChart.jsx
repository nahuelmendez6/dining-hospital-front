import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';

import { useAuth } from '../../contexts/AuthContext';

const TodayTicketStatusChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const { accessToken: token } = useAuth();

  useEffect(() => {
    if (!token) {
      setErrorMsg("Token no disponible. Iniciá sesión.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/reports/tickets-by-day/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Datos recibidos:", response.data);
        const transformed = transformData(response.data);
        setData(transformed);
        setErrorMsg(null);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setErrorMsg("Error al obtener datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const transformData = (rawData) => {
    const grouped = {};
    rawData.forEach(item => {
      const { shift_name, status, count } = item;
      if (!grouped[shift_name]) {
        grouped[shift_name] = {
          shift_name,
          pending: 0,
          used: 0,
          cancelled: 0, // aunque no uses cancelados, lo inicializo para evitar problemas futuros
        };
      }
      grouped[shift_name][status] = count;
    });
    return Object.values(grouped);
  };

  if (loading) return <p className="text-gray-500">Cargando datos...</p>;
  if (errorMsg) return <p className="text-red-500">{errorMsg}</p>;
  if (data.length === 0) return <p className="text-gray-700">No hay datos para hoy.</p>;

  return (
    <div className="w-full h-96 p-4">
      <h2 className="text-xl font-semibold mb-4">Tickets por turno y estado (hoy)</h2>
      <div style={{ width: 600, height: 400, padding: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
            <XAxis dataKey="shift_name" />
            <YAxis allowDecimals={false} />
            <CartesianGrid stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Bar dataKey="pending" stackId="a" fill="#facc15" name="Pendientes" />
            <Bar dataKey="used" stackId="a" fill="#22c55e" name="Usados" />
            {/* Cancelados lo dejé comentado por ahora */}
            {/* <Bar dataKey="cancelled" stackId="a" fill="#ef4444" name="Cancelados" /> */}
            </BarChart>
        </ResponsiveContainer>
      </div>
      
    </div>
  );
};

export default TodayTicketStatusChart;
