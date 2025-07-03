import { Modal } from "react-bootstrap";
import IngredientForm from "./IngredientForm";

function IngredientModal({ show, onHide, token }) {
  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Ingrediente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <IngredientForm token={token} closeModal={onHide} />
      </Modal.Body>
    </Modal>
  );
}

export default IngredientModal;
