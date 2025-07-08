import React from 'react';
import useStockMovementReport from '../../hooks/useStockMovementReport';

const StockMovementReport = () => {
  const initialFilters = {
    start: '',
    end: '',
    type: '',
    menu_item_id: '',
    ingredient_id: ''
  };

  const { data: results, filters, setFilters, loading, error } = useStockMovementReport(initialFilters);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-4">
      <h2>Reporte de Movimientos de Stock</h2>
      
      <div className="row g-2 mb-3">
        <div className="col-md">
          <input type="datetime-local" name="start" value={filters.start} onChange={handleChange} className="form-control" placeholder="Desde" />
        </div>
        <div className="col-md">
          <input type="datetime-local" name="end" value={filters.end} onChange={handleChange} className="form-control" placeholder="Hasta" />
        </div>
        <div className="col-md">
          <select name="type" value={filters.type} onChange={handleChange} className="form-select">
            <option value="">Tipo</option>
            <option value="input">Ingreso</option>
            <option value="output">Egreso</option>
          </select>
        </div>
        <div className="col-md">
          <input type="number" name="menu_item_id" value={filters.menu_item_id} onChange={handleChange} className="form-control" placeholder="ID Item" />
        </div>
        <div className="col-md">
          <input type="number" name="ingredient_id" value={filters.ingredient_id} onChange={handleChange} className="form-control" placeholder="ID Ingrediente" />
        </div>
        <div className="col-md">
          <button className="btn btn-primary w-100" onClick={() => setFilters({ ...filters })} disabled={loading}>
            {loading ? 'Cargando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {loading ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : results.length === 0 ? (
        <p>No hay datos disponibles.</p>
      ) : (
        <table className="table table-sm table-striped table-hover align-middle text-center border">
          <thead className="table-light">
            <tr>
              <th scope="col" className="border-end text-dark">ID</th>
              <th scope="col" className="border-end text-dark">Tipo</th>
              <th scope="col" className="border-end text-dark">Item</th>
              <th scope="col" className="border-end text-dark">Ingrediente</th>
              <th scope="col" className="border-end text-dark">Cantidad</th>
              <th scope="col" className="border-end text-dark">Fecha</th>
              <th scope="col" className="border-end text-dark">Usuario</th>
              <th scope="col">Ticket</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {results.map((r) => (
              <tr key={r.id} className="small">
                <td className="border-end">{r.id}</td>
                <td className={`text-capitalize border-end ${r.movement_type === 'input' ? 'text-green' : 'text-red'}`}>{r.movement_type}</td>
                <td className="border-end">{r.menu_item_name || '-'}</td>
                <td className="border-end">{r.ingredient_name || '-'}</td>
                <td className="border-end">{r.quantity}</td>
                <td className="border-end">{new Date(r.timestamp).toLocaleString()}</td>
                <td className="border-end">{r.performed_by_name || '-'}</td>
                <td>{r.related_ticket_id || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockMovementReport;