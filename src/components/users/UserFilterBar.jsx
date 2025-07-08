const UserFilterBar = ({ searchTerm, setSearchTerm, groupFilter, setGroupFilter }) => {
    return (
      <div className="row g-3 align-items-center mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
          >
            <option value="">Todos los grupos</option>
            <option value="admin">Administrador</option>
            <option value="comensal">Comensal</option>
            <option value="cocina">Cocina</option>
          </select>
        </div>
        <div className="col-md-2 text-end">
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setSearchTerm('');
              setGroupFilter('');
            }}
          >
            Limpiar
          </button>
        </div>
      </div>
    );
  };
  
  export default UserFilterBar;