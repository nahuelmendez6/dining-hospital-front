import React from 'react';
import useStockEvaluationReport from '../../hooks/useStockEvaluationReport';

const StockEvaluationReport = () => {
  const initialFilters = {
    start_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      return d.toISOString().slice(0, 10);
    })(),
    end_date: new Date().toISOString().slice(0, 10),
    status: '',
  };

  const { data, filters, setFilters, loading, error } = useStockEvaluationReport(initialFilters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4">Reporte de Evaluación de Stock</h2>

      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label>Fecha Inicio</label><br />
          <input
            type="date"
            name="start_date"
            value={filters.start_date}
            onChange={handleFilterChange}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label>Fecha Fin</label><br />
          <input
            type="date"
            name="end_date"
            value={filters.end_date}
            onChange={handleFilterChange}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label>Estado</label><br />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border p-1 rounded"
          >
            <option value="">Todos (used + pending)</option>
            <option value="pending">Pendiente</option>
            <option value="used">Usado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : data.length === 0 ? (
        <p>No hay datos disponibles.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2 py-1">Item</th>
              <th className="border border-gray-300 px-2 py-1">Stock Actual</th>
              <th className="border border-gray-300 px-2 py-1">Cantidad Consumida</th>
              <th className="border border-gray-300 px-2 py-1">Icono</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td className="border border-gray-300 px-2 py-1">{item.name}</td>
                <td className="border border-gray-300 px-2 py-1">{item.stock_actual}</td>
                <td className="border border-gray-300 px-2 py-1">{item.consumed_quantity}</td>
                <td className="border border-gray-300 px-2 py-1">
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

export default StockEvaluationReport;
