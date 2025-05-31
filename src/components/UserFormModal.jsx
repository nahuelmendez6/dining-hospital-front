import React from 'react';

const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  departments,
  editing
}) => 
{
  if (!isOpen) return null;

  return (
    <>
      <div className="modal fade show" style={{ display: 'block' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={onSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{editing ? 'Editar Usuario' : 'Nuevo Usuario'}</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <input className="form-control" type="text" name="name" placeholder="Nombre"
                         value={formData.name} onChange={onChange} />
                </div>
                <div className="mb-2">
                  <input className="form-control" type="text" name="lastname" placeholder="Apellido"
                         value={formData.lastname} onChange={onChange} />
                </div>
                <div className="mb-2">
                  <input className="form-control" type="text" name="dni" placeholder="DNI"
                         value={formData.dni} onChange={onChange} />
                </div>
                <div className="mb-2">
                  <input className="form-control" type="email" name="email" placeholder="Email"
                         value={formData.email} onChange={onChange} />
                </div>
                <div className="mb-2">
                  <select className="form-control" name="department" value={formData.department} onChange={onChange}>
                    <option value="">Seleccionar Departamento</option>
                    {departments.map(dep => (
                      <option key={dep.id} value={dep.id}>{dep.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Actualizar' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default UserFormModal;
