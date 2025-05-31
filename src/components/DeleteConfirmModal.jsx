import React from 'react';

const DeleteConfirmModal = ({ show, onClose, onConfirm, user }) => {
  if (!show) return null;

  return (
    <>
      <div className="modal fade show" style={{ display: 'block' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Eliminar Usuario</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              ¿Estás seguro de que deseas eliminar al usuario <strong>{user?.first_name} {user?.last_name}</strong>?
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button className="btn btn-danger" onClick={onConfirm}>Eliminar</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default DeleteConfirmModal;
