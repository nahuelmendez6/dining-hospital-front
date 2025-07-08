import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import useItemConsumptionTrend from '../../hooks/useItemConsumptionTrend';

const ItemConsumptionTrend = () => {
  const { data, items, loading, error } = useItemConsumptionTrend();

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Tendencia de Consumo por Ítem</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : data.length === 0 ? (
        <p>No hay datos disponibles.</p>
      ) : (
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              {items.map((item, idx) => (
                <Line
                  key={`line-${item}-${idx}`}
                  type="monotone"
                  dataKey={item}
                  stroke={`hsl(${(idx * 60) % 360}, 70%, 50%)`}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ItemConsumptionTrend;
