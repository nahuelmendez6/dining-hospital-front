import React, { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { createMenuItem, updateMenuItem } from "../../services/menuService";
import IconSelect from "./IconSelect";
import { foodIcons } from "../../icons/foodIcons";
import RecipeEditor from "./RecipeEditor";
import { useAuth } from "../../contexts/AuthContext"

function MenuItemForm({ initialItem, onSubmit, onCancel, compact = false }) {
  const [name, setName] = useState("");
  const [iconName, setIconName] = useState("FaCoffee");
  const [stock, setStock] = useState(0);
  const [min_stock, setmin_stock] = useState(0);
  const [cost, setCost] = useState(0);
  const [category, setCategory] = useState("drink_hot");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const Icon = foodIcons[iconName] || FaIcons.FaUtensils;

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

  const { accessToken } = useAuth();


  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name || "");
      setIconName(initialItem.icon_name || "FaCoffee");
      setStock(initialItem.stock || 0);
      setmin_stock(initialItem.min_stock || 0);
      setCategory(initialItem.category || "drink_hot");
      setCost(initialItem.cost || 0);
    } else {
      setName("");
      setIconName("FaCoffee");
      setStock(0);
      setmin_stock(0);
      setCategory("drink_hot");
      setCost(0);
    }
  }, [initialItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = { 
      name, 
      icon_name: iconName, 
      stock: stock || 0, 
      min_stock: min_stock || 0, 
      category, 
      cost: parseFloat(cost) || 0 };
    console.log("Token actual:", accessToken);

    try {
      if (initialItem) {
        await updateMenuItem(initialItem.id, data, accessToken);
        toast.success("Ítem actualizado correctamente");
      } else {
        await createMenuItem(data, accessToken);
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
      <form
  onSubmit={handleSubmit}
  className="card shadow-sm mx-auto p-2"
  style={{ maxWidth: 700 }}
  noValidate
>
  <div className="row g-2 align-items-center">
    {/* Nombre */}
    <div className="col-md-4">
      <label htmlFor="nameInput" className="form-label mb-1 fw-semibold">Nombre</label>
      <input
        id="nameInput"
        type="text"
        className="form-control form-control-sm"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ej: Café"
        required
      />
    </div>

    {/* Categoría */}
    <div className="col-md-4">
      <label htmlFor="categorySelect" className="form-label mb-1 fw-semibold">Categoría</label>
      <select
        id="categorySelect"
        className="form-select form-select-sm"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        {CATEGORY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>

    {/* Stock */}
    <div className="col-md-2">
      <label htmlFor="stockInput" className="form-label mb-1 fw-semibold">Stock</label>
      <input
        id="stockInput"
        type="number"
        min="0"
        className="form-control form-control-sm text-center"
        value={stock}
        onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
        required
      />
    </div>

    {/* Stock mínimo*/}
    <div className="col-md-2">
      <label htmlFor="minStockInput" className="form-label mb-1 fw-semibold">Stock mínimo</label>
      <input
        id="minStockInput"
        type="number"
        min="0"
        className="form-control form-control-sm text-center"
        value={min_stock}
        onChange={(e) => setmin_stock(Math.max(0, parseInt(e.target.value) || 0))}
        required
      />
    </div>

    {/* Costo */}
    <div className="col-md-2">
      <label htmlFor="costInput" className="form-label mb-1 fw-semibold">Costo</label>
      <input
        id="costInput"
        type="number"
        min="0"
        step="0.01"
        className="form-control form-control-sm text-center"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        required
      />
    </div>

    {/* Icono */}
    <div className="col-12 d-flex align-items-center mt-2">
      <div className="me-2 d-flex align-items-center">
        <label className="form-label mb-0 me-2 fw-semibold">Ícono</label>
        <div
          className="border rounded bg-light d-flex align-items-center justify-content-center"
          style={{ width: 36, height: 36, fontSize: 20 }}
        >
          <Icon />
        </div>
      </div>
      <div style={{ width: 120, minWidth: 120 }}>
  <IconSelect value={iconName} onChange={setIconName} compact />
</div>
    </div>

    {/* Botones */}
    <div className="col-12 d-flex justify-content-end gap-2 mt-3">
      {initialItem && (
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
      )}
      <button
        type="submit"
        className="btn btn-primary btn-sm"
        disabled={isSubmitting}
      >
        {initialItem ? "Actualizar" : "Crear"}
      </button>
    </div>
  </div>

  {/* Receta */}
  {initialItem && (
    <div className="card mt-2 p-2 shadow-sm">
      <RecipeEditor menuItemId={initialItem.id} />
    </div>
  )}
</form>


      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default MenuItemForm;
