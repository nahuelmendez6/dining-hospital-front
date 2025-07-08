import React, { useState, useEffect } from 'react';
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
import useTotalIngredientConsumptionReport from '../../hooks/useTotalIngredientConsumptionReport';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TotalIngredientConsumptionReport = () => {
  const initialStartDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  })();
  const initialEndDate = new Date().toISOString().slice(0, 10);

  const { data, filters, setFilters, loading, error } = useTotalIngredientConsumptionReport({
    start: initialStartDate,
    end: initialEndDate,
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

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
        ticks: { callback: v => `${v}` }
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
            name="start"
            value={filters.start}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Hasta</label>
          <input
            type="date"
            className="form-control"
            name="end"
            value={filters.end}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
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
