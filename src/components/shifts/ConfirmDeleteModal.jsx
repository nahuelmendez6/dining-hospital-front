import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

const ConfirmDeleteModal = ({ show, onHide, onConfirm, loading }) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton>
      <Modal.Title>Confirmar eliminación</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>¿Estás seguro de que deseas eliminar este turno?</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide} disabled={loading}>
        Cancelar
      </Button>
      <Button variant="danger" onClick={onConfirm} disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Eliminar'}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmDeleteModal;
