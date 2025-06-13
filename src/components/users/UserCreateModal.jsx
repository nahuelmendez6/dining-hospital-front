const UserCreateModal = ({ isOpen, onClose, onChange, onSubmit, formData }) => {
    if (!isOpen) return null;
    return (
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={onSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Nuevo Usuario</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
              </div>
              <div className="modal-body">
                {/* Campos del formulario */}
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input name="first_name" value={formData.first_name} onChange={onChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input name="last_name" value={formData.last_name} onChange={onChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">DNI</label>
                  <input name="dni" value={formData.dni} onChange={onChange} className="form-control" pattern="\d*" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input name="email" type="email" value={formData.email} onChange={onChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Grupo</label>
                  <select name="group" value={formData.group} onChange={onChange} className="form-select" required>
                    <option value="">Seleccione un grupo...</option>
                    <option value="admin">Administrador</option>
                    <option value="hospital">Hospital</option>
                    <option value="cocina">Cocina</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Guardar</button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  export default UserCreateModal;
  