import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { createMenuItem, updateMenuItem } from "../../services/menuService";
import IconSelect from "./IconSelect";
import { foodIcons } from "../../icons/foodIcons";
import RecipeEditor from "./RecipeEditor";
import { useAuth } from "../../contexts/AuthContext";

const CATEGORY_OPTIONS = [
  { value: "drink_hot", label: "Bebidas Calientes" },
  { value: "drink_cold", label: "Bebidas Frías" },
  { value: "bakery", label: "Panificados y Repostería" },
  { value: "fruit", label: "Frutas" },
  { value: "dairy", label: "Lácteos y Untables" },
  { value: "snack", label: "Snacks" },
  { value: "main_course", label: "Platos Principales" },
  { value: "combo", label: "Menús Armados / Ejecutivos" },
  { value: "dessert", label: "Postres" },
  { value: "other", label: "Otros" },
];

function MenuItemForm({ initialItem, onSubmit, onCancel }) {
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    icon_name: "FaCoffee",
    stock: 0,
    min_stock: 0,
    cost: 0,
    category: "drink_hot",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const Icon = foodIcons[formData.icon_name] || foodIcons["FaUtensils"];

  useEffect(() => {
    if (initialItem) {
      setFormData({
        name: initialItem.name || "",
        icon_name: initialItem.icon_name || "FaCoffee",
        stock: initialItem.stock || 0,
        min_stock: initialItem.min_stock || 0,
        cost: initialItem.cost || 0,
        category: initialItem.category || "drink_hot",
      });
    }
  }, [initialItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ["stock", "min_stock", "cost"].includes(name)
      ? parseFloat(value) || 0
      : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (initialItem) {
        await updateMenuItem(initialItem.id, formData, accessToken);
        toast.success("Ítem actualizado correctamente");
      } else {
        await createMenuItem(formData, accessToken);
        toast.success("Ítem creado correctamente");
      }
      onSubmit?.();
    } catch (error) {
      toast.error("Error al guardar el ítem");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="shadow-sm p-3 card">
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
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </Col>

          <Col md={2}>
            <Form.Label>Stock mínimo</Form.Label>
            <Form.Control
              type="number"
              name="min_stock"
              value={formData.min_stock}
              onChange={handleChange}
            />
          </Col>

          <Col md={2}>
            <Form.Label>Categoria</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {CATEGORY_OPTIONS.map((opt) => (
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

          <Col md={1}>
            <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting}>
              {initialItem ? "✔" : "+"}
            </Button>
          </Col>

          {initialItem && (
            <Col md={1}>
              <Button variant="secondary" className="w-100" onClick={onCancel}>
                ✕
              </Button>
            </Col>
          )}
        </Row>

        {/* Icono + Selector */}
        <Row className="mt-3 align-items-center">
          <Col xs="auto">
            <Form.Label>Ícono</Form.Label>
            <div
              className="border rounded bg-light d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36, fontSize: 20 }}
            >
              <Icon />
            </div>
          </Col>
          <Col xs={3}>
            <IconSelect value={formData.icon_name} onChange={(val) =>
              setFormData((prev) => ({ ...prev, icon_name: val }))
            } />
          </Col>
        </Row>

        {/* Editor de receta */}
        {initialItem?.id && (
          <Row className="mt-3">
            <Col>
              <RecipeEditor key={initialItem.id} menuItemId={initialItem.id} />
            </Col>
          </Row>
        )}
      </Form>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default MenuItemForm;
