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

const MenuSimpleCostReport = () => {
  const { accessToken } = useAuth();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/reports/menu-simple-cost/', {
        params: { start: startDate, end: endDate },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setData(res.data || []);
    } catch (error) {
      console.error('Error al obtener el reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  // Inicializo fechas: último mes
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);
    const lastMonthStr = lastMonth.toISOString().slice(0, 10);

    setStartDate(lastMonthStr);
    setEndDate(today);
  }, []);

  // Refrescar datos cuando cambian fechas
  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const chartData = {
    labels: data.map(d => d.menu_item),
    datasets: [
      {
        label: 'Costo proyectado ($)',
        data: data.map(d => d.projected_cost),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Costo proyectado por ítem sin receta (${startDate} a ${endDate})`,
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
        ticks: {
          callback: v => `$${v}`
        }
      }
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Reporte de costos proyectados por ítem sin receta</h4>

      {/* Filtros de fecha */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">Desde</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            max={endDate}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Hasta</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            min={startDate}
            max={new Date().toISOString().slice(0, 10)}
          />
        </div>
      </div>

      {loading ? (
        <p>Cargando datos...</p>
      ) : data.length === 0 ? (
        <p className="text-muted">No hay ítems sin receta consumidos en el rango seleccionado.</p>
      ) : (
        <>
          {/* Gráfico */}
          <div className="mb-4" style={{ height: '400px' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* Tabla con más detalles */}
          <table className="table table-striped table-bordered text-center align-middle table-sm">
            <thead className="table-warning">
              <tr>
                <th>Ítem</th>
                <th>Costo Unitario ($)</th>
                <th>Cantidad Consumida</th>
                <th>Costo Proyectado ($)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, idx) => (
                <tr key={idx}>
                  <td>{d.menu_item}</td>
                  <td>${d.unit_cost.toFixed(2)}</td>
                  <td>{d.consumed_quantity.toFixed(2)}</td>
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

export default MenuSimpleCostReport;
