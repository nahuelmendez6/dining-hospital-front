import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import useUserConsumptionReport from '../../hooks/useUserConsumptionReport';

const UserConsumptionReportChart = () => {
  const initialFilters = {
    start_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      return d.toISOString().slice(0, 10);
    })(),
    end_date: new Date().toISOString().slice(0, 10),
    status: '',
  };

  const { data, filters, setFilters, loading, error } = useUserConsumptionReport(initialFilters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4">Consumo por Usuario</h2>

      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label>Fecha Inicio</label><br />
          <input
            type="date"
            name="start_date"
            value={filters.start_date}
            onChange={handleFilterChange}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label>Fecha Fin</label><br />
          <input
            type="date"
            name="end_date"
            value={filters.end_date}
            onChange={handleFilterChange}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label>Estado</label><br />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
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
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="user_name"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={70}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_items" name="Total Ítems" fill="#3182CE" />
            <Bar dataKey="total_tickets" name="Total Tickets" fill="#63B3ED" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default UserConsumptionReportChart;
