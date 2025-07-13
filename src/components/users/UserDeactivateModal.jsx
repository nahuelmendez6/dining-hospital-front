const UserDeactivateModal = ({ show, onCancel, onConfirm, userName }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmar Desactivación</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <p>¿Estás seguro de que quieres desactivar al usuario <strong>{userName}</strong>?</p>
            <p className="text-danger">Esta acción no se puede deshacer.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              Desactivar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDeactivateModal;
