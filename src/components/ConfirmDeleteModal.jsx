export default function ConfirmDeleteModal({ shift, onCancel, onConfirm }) {
    return (
      <div className="modal">
        <p>¿Estás seguro que deseas eliminar el turno <strong>{shift.name}</strong>?</p>
        <button onClick={onConfirm}>Sí, eliminar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    );
  }
  