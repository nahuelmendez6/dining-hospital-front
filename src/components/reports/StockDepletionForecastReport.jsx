import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockDepletionForecastReport = () => {
  const [days, setDays] = useState(7);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [data, setData] = useState([]);
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
      setData(response.data.results || []);
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
      <h2 className="text-xl font-bold mb-4">Proyección de Agotamiento de Stock</h2>

      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label>Días de análisis</label><br />
          <input
            type="number"
            min="1"
            value={days}
            onChange={(e) => setDays(e.target.value)}
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
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Ítem</th>
              <th className="border px-2 py-1">Stock actual</th>
              <th className="border px-2 py-1">Consumo total ({days} días)</th>
              <th className="border px-2 py-1">Prom. diario</th>
              <th className="border px-2 py-1">Días restantes</th>
              <th className="border px-2 py-1">Icono</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className={item.dias_estimados_restantes <= 3 ? 'bg-red-100' : ''}>
                <td className="border px-2 py-1">{item.name}</td>
                <td className="border px-2 py-1">{item.stock_actual}</td>
                <td className="border px-2 py-1">{item.consumo_total}</td>
                <td className="border px-2 py-1">{item.consumo_promedio_diario.toFixed(2)}</td>
                <td className="border px-2 py-1">{item.dias_estimados_restantes}</td>
                <td className="border px-2 py-1">
                  {item.icon_name ? (
                    <img
                      src={`/path/to/icons/${item.icon_name}.svg`}
                      alt={item.name}
                      style={{ width: 24, height: 24 }}
                    />
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockDepletionForecastReport;
