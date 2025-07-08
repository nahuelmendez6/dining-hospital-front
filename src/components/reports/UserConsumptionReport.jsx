import React from 'react';
import useUserConsumptionReport from '../../hooks/useUserConsumptionReport';

const UserConsumptionReport = () => {
  const initialFilters = {
    start_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      return d.toISOString().slice(0, 10);
    })(),
    end_date: new Date().toISOString().slice(0, 10),
    status: '',
  };

  const { data, filters, setFilters, loading, error } = useUserConsumptionReport(initialFilters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4">Consumo por Usuario</h2>

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
            <option value="">Todos (usados + pendientes)</option>
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
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 text-left">Usuario</th>
              <th className="border px-2 py-1 text-center">Total Tickets</th>
              <th className="border px-2 py-1 text-center">Total Ítems</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{user.user_name}</td>
                <td className="border px-2 py-1 text-center">{user.total_tickets}</td>
                <td className="border px-2 py-1 text-center">{user.total_items}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserConsumptionReport;
