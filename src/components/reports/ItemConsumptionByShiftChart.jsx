import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';

const ItemConsumptionByShiftChart = () => {
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [startDate, setStartDate] = useState('2025-06-15');
  const [endDate, setEndDate] = useState('2025-06-22');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (status) params.status = status;

      const response = await axios.get('http://localhost:8000/reports/item-consumption-by-shift/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params,
      });

      const rawResults = response.data.results || {};

      const allItems = new Set();
      const formatted = Object.entries(rawResults).map(([shift, itemList]) => {
        const entry = { shift };
        itemList.forEach(({ item, quantity }) => {
          entry[item] = quantity;
          allItems.add(item);
        });
        return entry;
      });

      setItems(Array.from(allItems));
      setData(formatted);

    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, status]);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Consumo de Ítems por Turno</h2>

      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label>Fecha Inicio</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-1 rounded" />
        </div>
        <div>
          <label>Fecha Fin</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-1 rounded" />
        </div>
        <div>
          <label>Estado</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="border p-1 rounded">
            <option value="">Usado + Pendiente</option>
            <option value="pending">Pendiente</option>
            <option value="used">Usado</option>
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
              <XAxis dataKey="shift" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              {items.map((item, idx) => (
                <Bar
                  key={`bar-${item}`}
                  dataKey={item}
                  stackId="a"
                  fill={`hsl(${(idx * 60) % 360}, 70%, 50%)`}
                  name={item}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ItemConsumptionByShiftChart;
