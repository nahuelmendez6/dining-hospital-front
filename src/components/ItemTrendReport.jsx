import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function ItemTrendReport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/reports/item-trends/').then(res => setData(res.data));
  }, []);

  const grouped = {};

  data.forEach(entry => {
    const { item__name, ticket__date_only, total } = entry;
    if (!grouped[item__name]) grouped[item__name] = {};
    grouped[item__name][ticket__date_only] = total;
  });

  const labels = [...new Set(data.map(e => e.ticket__date_only))].sort();
  const datasets = Object.entries(grouped).map(([item, values]) => ({
    label: item,
    data: labels.map(date => values[date] || 0),
    fill: false,
    borderWidth: 2
  }));

  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Tendencias de consumo</h2>
      <Line data={{ labels, datasets }} />
    </div>
  );
}
