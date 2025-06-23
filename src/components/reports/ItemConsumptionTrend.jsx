import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const ItemConsumptionTrend = () => {
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Utilidad para transformar datos crudos en formato de gráfico
  const transformData = (rawData) => {
    const groupedByDate = {};

    rawData.forEach(({ date, item, quantity }) => {
      if (!groupedByDate[date]) groupedByDate[date] = { date };
      groupedByDate[date][item] = quantity;
    });

    return Object.values(groupedByDate);
  };

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get('http://localhost:8000/reports/item-trends/', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
      
          const results = response.data.results ?? response.data;
          console.log("Datos recibidos:", results);
      
          const transformedResults = results.map(r => ({
            date: r.ticket__date_only,
            item: r.item__name,
            quantity: r.total
          }));
      
          const uniqueItems = [...new Set(transformedResults.map(r => r.item))];
          setItems(uniqueItems);
      
          const formattedData = transformData(transformedResults);
          setData(formattedData);
      
        } catch (error) {
          console.error("Error al obtener datos de consumo:", error);
        } finally {
          setLoading(false);
        }
      };
      

    fetchData();
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Tendencia de Consumo por Ítem</h2>

      {loading ? (
        <p>Cargando...</p>
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
