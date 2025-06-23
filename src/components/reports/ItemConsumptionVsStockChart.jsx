import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';

const ItemConsumptionVsStockChart = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('2025-05-22');
  const [endDate, setEndDate] = useState('2025-06-22');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        start_date: startDate,
        end_date: endDate,
      };
      if (status) params.status = status;

      const response = await axios.get('http://localhost:8000/reports/item-consumption-vs-stock/', {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const apiData = response.data.results.map(item => ({
        name: item.item__name,
        consumed: item.total_consumed,
        stock: item.item__stock,
      }));

      console.log('Datos recibidos:', apiData);
      setData(apiData);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, status]);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Consumo vs Stock por Ítem</h2>

      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label className="block text-sm">Fecha Inicio</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Fecha Fin</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Estado</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="">Todos</option>
            <option value="used">Usado</option>
            <option value="pending">Pendiente</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="consumed" fill="#EF4444" name="Consumido" />
              <Bar dataKey="stock" fill="#10B981" name="Stock Disponible" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ItemConsumptionVsStockChart;
