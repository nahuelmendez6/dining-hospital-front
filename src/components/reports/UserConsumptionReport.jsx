import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserConsumptionReport = () => {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (status) params.status = status;

      const response = await axios.get('http://localhost:8000/reports/user-consumption-report/', {
        params,
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
  }, [startDate, endDate, status]);

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4">Consumo por Usuario</h2>

      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label>Fecha Inicio</label><br />
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label>Fecha Fin</label><br />
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label>Estado</label><br />
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="">Todos (usados + pendientes)</option>
            <option value="pending">Pendiente</option>
            <option value="used">Usado</option>
            <option value="cancelled">Cancelado</option>
          </select>
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
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 text-left">Usuario</th>
              <th className="border px-2 py-1 text-center">Total Tickets</th>
              <th className="border px-2 py-1 text-center">Total Ítems</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{user.user_name}</td>
                <td className="border px-2 py-1 text-center">{user.total_tickets}</td>
                <td className="border px-2 py-1 text-center">{user.total_items}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserConsumptionReport;
