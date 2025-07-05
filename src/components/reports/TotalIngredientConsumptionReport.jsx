import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext.jsx';
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

const TotalIngredientConsumptionReport = () => {
  const { accessToken } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/reports/ingredient-report/', {
        params: { start: startDate, end: endDate },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setData(res.data || []);
    } catch (err) {
      console.error('Error al obtener datos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    setStartDate(monthAgo.toISOString().slice(0, 10));
    setEndDate(today);
  }, []);

  useEffect(() => {
    if (startDate && endDate) fetchData();
  }, [startDate, endDate]);

  const chartData = {
    labels: data.map(d => d.ingredient_name),
    datasets: [{
      label: 'Costo proyectado ($)',
      data: data.map(d => d.projected_cost),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Costo total por ingrediente',
        font: { size: 18 }
      },
      tooltip: {
        callbacks: {
          label: ctx => `$ ${ctx.parsed.x.toFixed(2)}`
        }
      },
      legend: { display: false }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { callback: v => `$${v}` }
      }
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Consumo total de ingredientes</h4>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-3">
          <label className="form-label">Desde</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Hasta</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : data.length === 0 ? (
        <p className="text-muted">Sin datos para el rango seleccionado</p>
      ) : (
        <>
          {/* Gráfico */}
          <div className="mb-4" style={{ height: '400px' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* Tabla */}
          <table className="table table-bordered table-sm table-striped text-center align-middle">
            <thead className="table-info">
              <tr>
                <th>Ingrediente</th>
                <th>Cantidad consumida</th>
                <th>Unidad</th>
                <th>Costo proyectado ($)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, idx) => (
                <tr key={idx}>
                  <td>{d.ingredient_name}</td>
                  <td>{d.total_quantity.toFixed(2)}</td>
                  <td>{d.unit}</td>
                  <td>${d.projected_cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default TotalIngredientConsumptionReport;
