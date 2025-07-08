import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';
import useItemConsumptionVsStock from '../../hooks/useItemConsumptionVsStock';

const ItemConsumptionVsStockChart = () => {
  const initialFilters = {
    start_date: '2025-05-22',
    end_date: '2025-06-22',
    status: '',
  };

  const { data, filters, setFilters, loading, error } = useItemConsumptionVsStock(initialFilters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Consumo vs Stock por Ítem</h2>

      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label className="block text-sm">Fecha Inicio</label>
          <input
            type="date"
            name="start_date"
            value={filters.start_date}
            onChange={handleFilterChange}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Fecha Fin</label>
          <input
            type="date"
            name="end_date"
            value={filters.end_date}
            onChange={handleFilterChange}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Estado</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
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
      ) : error ? (
        <p>{error}</p>
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
