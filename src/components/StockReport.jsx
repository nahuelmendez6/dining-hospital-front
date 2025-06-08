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
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StockReport() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/reports/stock/')
      .then(res => setItems(res.data))
      .catch(err => console.error("Error al obtener stock:", err));
  }, []);

  const labels = items.map(item => item.name);
  const stockData = items.map(item => item.stock);
  const reference = 10;

  // Paleta de colores — se puede ampliar
  const colorPalette = [
    '#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f43f5e', '#6366f1', '#22d3ee'
  ];

  const backgroundColors = labels.map((_, i) => colorPalette[i % colorPalette.length]);
  const borderColors = backgroundColors.map(c => c);

  const data = {
    labels,
    datasets: [
      {
        label: 'Stock actual',
        data: stockData,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      },
      {
        label: `Stock mínimo (${reference})`,
        data: new Array(labels.length).fill(reference),
        type: 'line',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Stock de productos con referencia mínima' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Reporte de Stock</h2>
      <div style={{ height: '250px', position: 'relative' }}> {/* Ajustá la altura aquí */}
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
