import React from 'react';
import useStockDepletionForecastReport from '../../hooks/useStockDepletionForecastReport';

const StockDepletionForecastReport = () => {
  const initialFilters = {
    days: 7,
    end_date: new Date().toISOString().slice(0, 10),
  };

  const { data, filters, setFilters, loading, error } = useStockDepletionForecastReport(initialFilters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: name === 'days' ? Number(value) : value,
    }));
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4">Proyección de Agotamiento de Stock</h2>

      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label>Días de análisis</label><br />
          <input
            type="number"
            min="1"
            name="days"
            value={filters.days}
            onChange={handleFilterChange}
            className="border p-1 rounded w-24"
          />
        </div>
        <div>
          <label>Fecha de corte</label><br />
          <input
            type="date"
            name="end_date"
            value={filters.end_date}
            onChange={handleFilterChange}
            className="border p-1 rounded"
          />
        </div>
      </div>

      {loading ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : data.length === 0 ? (
        <p>No hay datos disponibles.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Ítem</th>
              <th className="border px-2 py-1">Stock actual</th>
              <th className="border px-2 py-1">Consumo total ({filters.days} días)</th>
              <th className="border px-2 py-1">Prom. diario</th>
              <th className="border px-2 py-1">Días restantes</th>
              <th className="border px-2 py-1">Icono</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className={item.dias_estimados_restantes <= 3 ? 'bg-red-100' : ''}>
                <td className="border px-2 py-1">{item.name}</td>
                <td className="border px-2 py-1">{item.stock_actual}</td>
                <td className="border px-2 py-1">{item.consumo_total}</td>
                <td className="border px-2 py-1">{item.consumo_promedio_diario.toFixed(2)}</td>
                <td className="border px-2 py-1">{item.dias_estimados_restantes}</td>
                <td className="border px-2 py-1">
                  {item.icon_name ? (
                    <img
                      src={`/path/to/icons/${item.icon_name}.svg`}
                      alt={item.name}
                      style={{ width: 24, height: 24 }}
                    />
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockDepletionForecastReport;
