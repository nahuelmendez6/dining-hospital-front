import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import axios from 'axios';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MenuCostProjectionReport = () => {
  const { accessToken } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/reports/menu-cost-projection/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setData(res.data);
      } catch (error) {
        console.error('Error al obtener la proyección de costos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  // Preparar datos para el gráfico
  const chartData = {
    labels: data.map(item => item.menu_item),
    datasets: [
      {
        label: 'Costo proyectado ($)',
        data: data.map(item => item.projected_cost),
        backgroundColor: 'rgba(13, 110, 253, 0.6)', // Bootstrap primary
        borderColor: 'rgba(13, 110, 253, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: context => `$ ${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `$${value}`,
        },
      },
    },
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Proyección de Costo por Menú</h3>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          {/* Gráfico de barras */}
          <div className="mb-5">
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* Tabla */}
          <table className="table table-sm table-striped table-hover text-center align-middle border">
            <thead className="table-light">
              <tr>
                <th className="text-dark border-end">Ítem del Menú</th>
                <th className="text-dark">Costo Proyectado ($)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="small">
                  <td className="border-end">{item.menu_item}</td>
                  <td>${item.projected_cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default MenuCostProjectionReport;
