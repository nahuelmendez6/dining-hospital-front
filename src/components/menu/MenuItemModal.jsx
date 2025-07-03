import { Modal } from "react-bootstrap";
import MenuItemForm from "./MenuItemForm";

function MenuItemModal({ show, onHide, initialItem, onSubmit }) {
  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{initialItem ? "Editar Ítem" : "Nuevo Ítem"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MenuItemForm
          initialItem={initialItem}
          onSubmit={() => {
            onSubmit();
            onHide();
          }}
          onCancel={onHide}
        />
      </Modal.Body>
    </Modal>
  );
}

export default MenuItemModal;
