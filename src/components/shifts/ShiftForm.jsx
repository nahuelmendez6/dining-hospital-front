import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';

const ShiftForm = ({ onSubmit, onCancel, initialData, loading }) => {
  const [form, setForm] = useState({ name: '', start_time: '', end_time: '' });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        start_time: initialData.start_time || '',
        end_time: initialData.end_time || '',
      });
    } else {
      setForm({ name: '', start_time: '', end_time: '' });
    }
    setFormError(null);
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateTimes = () => {
    if (!form.name.trim()) {
      setFormError('El nombre es obligatorio.');
      return false;
    }
    if (!form.start_time || !form.end_time) {
      setFormError('Ambos horarios son obligatorios.');
      return false;
    }
    if (form.end_time <= form.start_time) {
      setFormError('La hora de fin debe ser posterior a la de inicio.');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateTimes()) onSubmit(form);
  };

  return (
    <Form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm">
      <h5>{initialData ? 'Editar Turno' : 'Crear Turno'}</h5>
      {formError && <Alert variant="danger">{formError}</Alert>}
      <Row className="align-items-center g-3">
        <Col md={4}>
          <Form.Control
            type="text"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="time"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </Col>
        <Col md={2} className="d-flex gap-2">
          <Button type="submit" variant="primary" disabled={loading} className="flex-grow-1">
            {loading ? <Spinner animation="border" size="sm" /> : initialData ? 'Actualizar' : 'Crear'}
          </Button>
          {initialData && (
            <Button variant="secondary" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default ShiftForm;
