import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ItemShiftReport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/reports/items-by-shift/')
      .then(res => setData(res.data))
      .catch(err => console.error("Error al obtener datos:", err));
  }, []);

  // Agrupar los datos por turno
  const grouped = {};
  data.forEach(({ item__name, ticket__shift__name, total }) => {
    if (!grouped[item__name]) grouped[item__name] = {};
    grouped[item__name][ticket__shift__name] = total;
  });

  const shifts = [...new Set(data.map(e => e.ticket__shift__name))];
  const items = [...new Set(data.map(e => e.item__name))];

  const datasets = shifts.map((shift, i) => ({
    label: shift,
    data: items.map(item => grouped[item]?.[shift] || 0),
    backgroundColor: `hsl(${(i * 360) / shifts.length}, 70%, 60%)`,
  }));

  const chartData = {
    labels: items,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Consumo de ítems por turno' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Consumo por turno</h2>

      {/* Gráfico con altura ajustada */}
      <div className="relative h-80 mb-6">
        <Bar data={chartData} options={options} />
      </div>

      {/* Tabla clásica */}
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="text-left">Ítem</th>
            <th className="text-left">Turno</th>
            <th className="text-left">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.item__name}</td>
              <td>{row['ticket__shift__name']}</td>
              <td>{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
