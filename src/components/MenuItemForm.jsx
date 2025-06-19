import { useEffect, useState } from 'react';
import axios from 'axios';
import * as FaIcons from "react-icons/fa";

import { foodIcons } from '../icons/foodIcons';

const API_URL = 'http://localhost:8000/';

function MenuItemForm({ initialItem, onSubmit, onCancel, shiftId }) {
  const [name, setName] = useState("");
  const [icon_name, setIcon] = useState("FaCoffee");
  const [stock, setStock] = useState(0);

  useEffect(() => {
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const data = { name, icon_name, stock: stock || 0  };

  //   try {
  //     if (initialItem) {
  //       const token = localStorage.getItem('accessToken');
  //       const headers = {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       };
  //       await axios.patch(`${API_URL}core/edit/menu-item/${initialItem.id}/`, data, { headers });
  //       alert("Ítem actualizado correctamente");
  //     } else {
  //       await axios.post(`${API_URL}core/menu-items/`, data);
  //       alert("Ítem creado correctamente");
  //     }
  
  //     setName("");
  //     setIcon("FaCoffee");
  //     setStock(0);
  
  //     if (onSubmit) onSubmit();
  //   } catch (error) {
  //     if (error.response && error.response.data) {
  //       alert(`Error: ${JSON.stringify(error.response.data)}`);
  //     } else {
  //       alert('Error desconocido al crear/actualizar ítem');
  //     }
  //   }
  // };

  // const Icon = FaIcons[icon_name] || FaIcons.FaQuestion;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, icon_name, stock: stock || 0 };
    const token = localStorage.getItem('accessToken');
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  
    try {
      if (initialItem) {
        await axios.patch(`${API_URL}core/edit/menu-item/${initialItem.id}/`, data, { headers });
        alert("Ítem actualizado correctamente");
      } else {
        // 1. Crear el ítem
        const createResponse = await axios.post(`${API_URL}core/menu-items/`, data, { headers });
        const newItem = createResponse.data;
  
        // 2. Obtener los ítems actuales asociados al shift
        const shiftResponse = await axios.get(`${API_URL}core/shifts/${shiftId}/edit/`, { headers });
        const currentItems = shiftResponse.data.menu_items;
  
        // 3. Actualizar el shift con los ítems + el nuevo
        const updatedItems = [...currentItems, newItem.id];
        await axios.patch(`${API_URL}core/shifts/${shiftId}/edit/`, {
          menu_items: updatedItems
        }, { headers });
  
        alert("Ítem creado y asignado al turno correctamente");
      }
  
      setName("");
      setIcon("FaCoffee");
      setStock(0);
  
      if (onSubmit) onSubmit();
    } catch (error) {
      if (error.response && error.response.data) {
        alert(`Error: ${JSON.stringify(error.response.data)}`);
      } else {
        alert('Error desconocido al crear/actualizar ítem');
      }
    }
  };
  

  const Icon = foodIcons[icon_name] || foodIcons.FaUtensils;
  

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border rounded-lg shadow w-full max-w-md">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del ítem"
        className="border p-2 rounded"
      />

      <input
        type="number"
        min="0"
        value={stock}
        onChange={(e) => setStock(parseInt(e.target.value))}
        placeholder="Stock"
        className="border p-2 rounded"
      />

      <select
        value={icon_name}
        onChange={(e) => setIcon(e.target.value)}
        className="border p-2 rounded"
      >
        {Object.keys(foodIcons).map(i => <option key={i} value={i}>{i}</option>)}
      </select>

      <div className="text-center">
        <div className="mx-auto mb-2 rounded-3 bg-light border shadow-sm"
             style={{
               width: 90,
               height: 90,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               fontSize: 32
             }}>
          <Icon />
        </div>
        <small className="text-muted">Previsualización del ícono</small>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {initialItem ? "Actualizar ítem" : "Crear ítem"}
        </button>
        {initialItem && (
          <button type="button" onClick={onCancel} className="bg-gray-300 p-2 rounded hover:bg-gray-400">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default MenuItemForm;
