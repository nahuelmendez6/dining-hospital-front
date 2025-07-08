import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';
import useStockDepletionForecast from '../../hooks/useStockDepletionForecast';

const StockDepletionForecastChart = () => {
  const initialFilters = {
    days: 7,
    end_date: new Date().toISOString().slice(0, 10),
  };

  const { data, colors, filters, setFilters, loading, error } = useStockDepletionForecast(initialFilters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: name === 'days' ? Number(value) : value,
    }));
  };

  return (
    <div className="w-full p-4">
      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label>Días de análisis</label><br />
          <input
            type="number"
            min="1"
            name="days"
            value={filters.days}
            onChange={handleFilterChange}
            className="border p-1 rounded w-24"
          />
        </div>
        <div>
          <label>Fecha de corte</label><br />
          <input
            type="date"
            name="end_date"
            value={filters.end_date}
            onChange={handleFilterChange}
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
