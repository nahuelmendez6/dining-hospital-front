import React from 'react';
import Select from 'react-select';
import * as FaIcons from "react-icons/fa";
import { foodIcons } from '../../icons/foodIcons';
import { toast } from 'react-toastify';

import axios from 'axios';

const API_URL = 'http://localhost:8000/';

const iconOptions = Object.keys(foodIcons).map(key => ({
  value: key,
  label: key,
  icon: foodIcons[key],
}));

const customSingleValue = ({ data }) => (
  <div className="d-flex align-items-center gap-2">
    <data.icon />
    <span>{data.label}</span>
  </div>
);

const customOption = (props) => {
  const { data, innerRef, innerProps } = props;
  return (
    <div
      ref={innerRef}
      {...innerProps}
      className="d-flex align-items-center gap-2 px-3 py-2"
      style={{ cursor: 'pointer' }}
    >
      <data.icon />
      <span>{data.label}</span>
    </div>
  );
};

function MenuItemForm({ initialItem, onSubmit, onCancel }) {
  const [name, setName] = React.useState("");
  const [icon_name, setIcon] = React.useState("FaCoffee");
  const [stock, setStock] = React.useState(0);

  React.useEffect(() => {
    if (initialItem) {
      setName(initialItem.name || "");
      setIcon(initialItem.icon_name || "FaCoffee");
      setStock(initialItem.stock || 0);
    } else {
      setName("");
      setIcon("FaCoffee");
      setStock(0);
    }
  }, [initialItem]);

  const Icon = foodIcons[icon_name] || FaIcons.FaUtensils;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, icon_name, stock: stock || 0 };
    const token = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      if (initialItem) {
        // Lógica de actualización aquí
        await axios.patch(`${API_URL}core/edit/menu-item/${initialItem.id}/`, data, { headers });
        toast.success("Ítem actualizado correctamente");
      } else {
        // Lógica de creación aquí
        await axios.post(`${API_URL}core/menu-items/`, data, { headers });
        toast.success("Ítem creado correctamente");
      }

      setName("");
      setIcon("FaCoffee");
      setStock(0);

      if (onSubmit) onSubmit();
    } catch (error) {
      toast.error("Error al guardar el ítem");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-0 shadow-sm" style={{ maxWidth: 900, margin: '0 auto' }}>
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
          <Select
            options={iconOptions}
            value={iconOptions.find(opt => opt.value === icon_name)}
            onChange={(opt) => setIcon(opt.value)}
            components={{ SingleValue: customSingleValue, Option: customOption }}
            isSearchable
            classNamePrefix="react-select"
            styles={{
              container: (base) => ({ ...base, width: '100%' }),
              control: (base) => ({
                ...base,
                borderRadius: '0.5rem',
                borderColor: '#ced4da',
                minHeight: '30px',
                fontSize: '0.8rem',
              }),
              option: (base) => ({ ...base, fontSize: '0.8rem', padding: '4px 6px' }),
              singleValue: (base) => ({ ...base, fontSize: '0.8rem' }),
            }}
          />
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

  );
}

export default MenuItemForm;
