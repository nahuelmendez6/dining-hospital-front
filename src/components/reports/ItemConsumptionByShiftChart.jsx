import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import useItemConsumptionByShift from '../../hooks/useItemConsumptionByShift';

const ItemConsumptionByShiftChart = () => {
  const initialFilters = {
    start_date: '2025-06-15',
    end_date: '2025-06-22',
    status: '',
  };

  const { data, items, filters, setFilters, loading, error } = useItemConsumptionByShift(initialFilters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Consumo de Ítems por Turno</h2>

      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label>Fecha Inicio</label>
          <input
            type="date"
            name="start_date"
            value={filters.start_date}
            onChange={handleFilterChange}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label>Fecha Fin</label>
          <input
            type="date"
            name="end_date"
            value={filters.end_date}
            onChange={handleFilterChange}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label>Estado</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border p-1 rounded"
          >
            <option value="">Usado + Pendiente</option>
            <option value="pending">Pendiente</option>
            <option value="used">Usado</option>
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
