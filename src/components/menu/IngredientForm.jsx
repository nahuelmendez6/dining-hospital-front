import { useState } from "react";
import { Form, Button, Alert, Row, Col, Table } from "react-bootstrap";
import { useIngredients } from "../../hooks/useIngredients";
import ConfirmDeleteModal from "../ConfirmDeleteModal";

const UNIT_OPTIONS = [
  { value: "unit", label: "Unidad" },
  { value: "g", label: "Gramos" },
  { value: "kg", label: "Kilogramos" },
  { value: "ml", label: "Mililitros" },
  { value: "l", label: "Litros" },
];

const COST_TYPE_OPTIONS = [
  { value: "per_unit", label: "Por unidad" },
  { value: "per_weight", label: "Por peso/volumen" },
];

function IngredientForm({ token }) {
  const { ingredients, error, addIngredient, editIngredient, removeIngredient, setError } = useIngredients(token);
  const [formData, setFormData] = useState({
    name: "",
    quantity_in_stock: 0,
    unit: "unit",
    cost: "",
    cost_type: "",
    description: "",
    min_stock: 0,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState(null);

  const isEditing = formData?.id != null;

  const resetForm = () => {
    setFormData({
      name: "",
      quantity_in_stock: 0,
      unit: "unit",
      cost: "",
      cost_type: "",
      description: "",
      min_stock: 0,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cost" || name === "quantity_in_stock" || name === "min_stock"
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      ...formData,
      cost: formData.cost === "" ? null : parseFloat(formData.cost),
      cost_type: formData.cost_type || null,
    };

    if (isEditing) {
      await editIngredient(formData.id, payload);
    } else {
      await addIngredient(payload);
    }

    if (!error) {
        resetForm();
    }
  };

  const handleDelete = (id) => {
    setIngredientToDelete(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (ingredientToDelete) {
      removeIngredient(ingredientToDelete);
      setIngredientToDelete(null);
    }
    setShowConfirmModal(false);
  };

  const handleEdit = (ing) => {
    setFormData({
      ...ing,
      cost: ing.cost ?? "",
      cost_type: ing.cost_type ?? "",
      min_stock: ing.min_stock ?? 0,
    });
  };

  return (
    <div className="mb-5">
      <h4>{isEditing ? "Editar Ingrediente" : "Nuevo Ingrediente"}</h4>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="g-2 align-items-end">
          <Col md={3}>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Col>

          <Col md={2}>
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="quantity_in_stock"
              step="0.01"
              value={formData.quantity_in_stock}
              onChange={handleChange}
              required
            />
          </Col>

          <Col md={2}>
            <Form.Label>Stock mínimo</Form.Label>
            <Form.Control
              type="number"
              name="min_stock"
              step="0.01"
              value={formData.min_stock}
              onChange={handleChange}
            />
          </Col>

          <Col md={2}>
            <Form.Label>Unidad</Form.Label>
            <Form.Select name="unit" value={formData.unit} onChange={handleChange}>
              {UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={2}>
            <Form.Label>Costo</Form.Label>
            <Form.Control
              type="number"
              name="cost"
              step="0.01"
              value={formData.cost}
              onChange={handleChange}
            />
          </Col>

          <Col md={2}>
            <Form.Label>Tipo de costo</Form.Label>
            <Form.Select
              name="cost_type"
              value={formData.cost_type}
              onChange={handleChange}
            >
              <option value="">-</option>
              {COST_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={1}>
            <Button type="submit" variant="primary" className="w-100">
              {isEditing ? "✔" : "+"}
            </Button>
          </Col>

          {isEditing && (
            <Col md={1}>
              <Button variant="secondary" className="w-100" onClick={resetForm}>
                ✕
              </Button>
            </Col>
          )}
        </Row>

        <Row className="mt-3">
          <Col>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              placeholder="Notas o detalles opcionales"
            />
          </Col>
        </Row>
      </Form>

      <hr />
      <h5 className="mt-4">Ingredientes cargados</h5>
      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Stock</th>
            <th>Stock mínimo</th>
            <th>Unidad</th>
            <th>Costo</th>
            <th>Tipo Costo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.length > 0 ? (
            ingredients.map((ing) => (
              <tr key={ing.id}>
                <td>{ing.name}</td>
                <td>{ing.quantity_in_stock}</td>
                <td>{ing.min_stock}</td>
                <td>{ing.unit}</td>
                <td>{ing.cost || "-"}</td>
                <td>{ing.cost_type || "-"}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-1"
                    onClick={() => handleEdit(ing)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(ing.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay ingredientes cargados.</td>
            </tr>
          )}
        </tbody>
      </Table>
      <ConfirmDeleteModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar el ingrediente?`}
      />
    </div>
  );
}

export default IngredientForm;