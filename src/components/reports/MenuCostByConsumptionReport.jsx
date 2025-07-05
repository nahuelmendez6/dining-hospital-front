import React, { useState } from 'react';
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
import { useAuth } from '../../contexts/AuthContext.jsx';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MenuCostByConsumptionReport = () => {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // --------- Fetch ----------
  const handleSearch = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      const params = { start: startDate, end: endDate };
      const res = await axios.get('http://localhost:8000/reports/menu-cost-by-consuption/', {
        params,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log('Datos recibidos:', res.data);
      setRows(res.data || []);
    } catch (err) {
      console.error('Error al obtener proyección por consumo:', err);
    } finally {
      setLoading(false);
    }
  };

  // --------- Chart ----------
  const chartData = {
    labels: rows.map(r => r.menu_item || 'Sin nombre'),
    datasets: [
      {
        label: 'Costo Proyectado ($)',
        data: rows.map(r => Number(r.projected_cost) || 0),
        backgroundColor: 'rgba(13,110,253,0.6)',
        borderColor: 'rgba(13,110,253,1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Costo proyectado según consumo (rango seleccionado)',
      },
      tooltip: {
        callbacks: {
          label: ctx => `$ ${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: v => `$${v}` },
      },
    },
  };

  // --------- Render ----------
  return (
    <div className="container mt-4">
      <h4 className="mb-3">Costo proyectado por consumo</h4>

      {/* Filtros */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">Desde</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Hasta</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button
            className="btn btn-primary w-100"
            onClick={handleSearch}
            disabled={!startDate || !endDate}
          >
            Buscar
          </button>
        </div>
      </div>

      {startDate && endDate && (
        <p className="text-muted mb-3">
          Rango seleccionado: <strong>{startDate}</strong> → <strong>{endDate}</strong>
        </p>
      )}

      {loading ? (
        <p>Cargando...</p>
      ) : rows.length ? (
        <>
          {/* Gráfico */}
          <div style={{ height: '400px', width: '100%' }} className="mb-4">
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* Tabla */}
          <div className="table-responsive">
            <table className="table table-sm table-striped table-hover text-center align-middle border">
              <thead className="table-light">
                <tr>
                  <th className="text-dark border-end">Ítem del menú</th>
                  <th className="text-dark border-end">Cant. consumida</th>
                  <th className="text-dark">Costo proyectado ($)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="small">
                    <td className="border-end">{r.menu_item}</td>
                    <td className="border-end">{r.total_consumed_quantity}</td>
                    <td>${r.projected_cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="text-muted">Sin datos para el rango seleccionado</p>
      )}
    </div>
  );
};

export default MenuCostByConsumptionReport;
