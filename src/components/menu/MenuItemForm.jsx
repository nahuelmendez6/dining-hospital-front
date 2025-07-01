import React, { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import { toast } from "react-toastify";
import { createMenuItem, updateMenuItem } from "../../services/menuService";
import IconSelect from "./IconSelect";
import { foodIcons } from "../../icons/foodIcons";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function MenuItemForm({ initialItem, onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [iconName, setIconName] = useState("FaCoffee");
  const [stock, setStock] = useState(0);

  const token = localStorage.getItem("accessToken");
  const Icon = foodIcons[iconName] || FaIcons.FaUtensils;

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name || "");
      setIconName(initialItem.icon_name || "FaCoffee");
      setStock(initialItem.stock || 0);
    } else {
      setName("");
      setIconName("FaCoffee");
      setStock(0);
    }
  }, [initialItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, icon_name: iconName, stock: stock || 0 };

    try {
      if (initialItem) {
        await updateMenuItem(initialItem.id, data, token);
        toast.success("Ítem actualizado correctamente");
      } else {
        await createMenuItem(data, token);
        toast.success("Ítem creado correctamente");
      }

      setName("");
      setIconName("FaCoffee");
      setStock(0);
      onSubmit?.();
    } catch (error) {
      toast.error("Error al guardar el ítem");
      console.error(error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="card p-3 shadow-sm"
        style={{ maxWidth: 900, margin: "0 auto" }}
      >
        <div className="row gx-2 gy-1 align-items-end">
          {/* Nombre */}
          <div className="col-auto">
            <label htmlFor="nameInput" className="form-label mb-1">Nombre</label>
            <input
              id="nameInput"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Café"
              className="form-control form-control-sm"
              required
              style={{ minWidth: 120 }}
            />
          </div>
  
          {/* Stock */}
          <div className="col-auto">
            <label htmlFor="stockInput" className="form-label mb-1">Stock</label>
            <input
              id="stockInput"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value))}
              className="form-control form-control-sm"
              style={{ width: 80 }}
            />
          </div>
  
          {/* Ícono */}
          <div className="col" style={{ minWidth: 200 }}>
            <label className="form-label mb-1">Ícono</label>
            <IconSelect value={iconName} onChange={setIconName} />
          </div>
  
          {/* Preview */}
          <div className="col-auto text-center">
            <div
              className="border rounded bg-light d-flex align-items-center justify-content-center"
              style={{ width: 32, height: 32, fontSize: 16 }}
            >
              <Icon />
            </div>
          </div>
  
          {/* Botones */}
          <div className="col-auto d-flex gap-1">
            {initialItem && (
              <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>
                Cancelar
              </button>
            )}
            <button type="submit" className="btn btn-primary btn-sm">
              {initialItem ? "Actualizar" : "Crear"}
            </button>
          </div>
        </div>
      </form>
  
      {/* Asegura los toast aunque el App no lo tenga */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
  
}

export default MenuItemForm;
