import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';

// Función para generar una paleta de colores
const generateColors = (count) => {
  const colors = [];
  const hueStep = 360 / count;
  for (let i = 0; i < count; i++) {
    colors.push(`hsl(${i * hueStep}, 70%, 50%)`);
  }
  return colors;
};

const StockDepletionForecastChart = () => {
  const [days, setDays] = useState(7);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [data, setData] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:8000/reports/stock-depletion-forecast/', {
        params: { days, end_date: endDate },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const results = response.data.results || [];
      setData(results);
      setColors(generateColors(results.length));
    } catch (err) {
      if (err.response) {
        setError(`Error ${err.response.status}: ${err.response.data.detail || JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        setError('No se recibió respuesta del servidor');
      } else {
        setError('Error: ' + err.message);
      }
      console.error('Error al obtener datos:', err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, [days, endDate]);

  return (
    <div className="w-full p-4">


      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label>Días de análisis</label><br />
          <input
            type="number"
            min="1"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="border p-1 rounded w-24"
          />
        </div>
        <div>
          <label>Fecha de corte</label><br />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-1 rounded"
          />
        </div>
      </div>

      {loading ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : data.length === 0 ? (
        <p>No hay datos disponibles.</p>
      ) : (
        <ResponsiveContainer width="100%" height={data.length * 50}>
          <BarChart data={data} layout="vertical" margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" label={{ value: 'Días restantes', position: 'insideBottomRight', offset: -5 }} />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="dias_estimados_restantes"
              name="Días restantes"
              isAnimationActive={false}
              label={{ position: 'right' }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default StockDepletionForecastChart;
