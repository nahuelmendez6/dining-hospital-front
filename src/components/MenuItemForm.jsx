import { useEffect, useState } from 'react';
import axios from 'axios';
import * as FaIcons from "react-icons/fa";

const icons = [
  "FaCoffee",
  "FaMugHot",
  "FaGlassWhiskey",
  "FaCheese",
  "FaEgg",
  "FaBreadSlice",
  "FaAppleAlt",
  "FaLemon",
  "FaIceCream",
  "FaWineGlass",
  "FaCookie",
  "FaUtensils"
];

const API_URL = 'http://localhost:8000/';

function MenuItemForm({ initialItem, onItemCreated, onCancel }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, icon_name, stock };

    if (initialItem) {
      await axios.patch(`${API_URL}core/edit/menu-item/${initialItem.id}/`, data);
      alert("Ítem actualizado correctamente");
    } else {
      await axios.post(`${API_URL}core/menu-items/`, data);
      alert("Ítem creado correctamente");
    }

    setName("");
    setIcon("FaCoffee");
    setStock(0);

    if (onItemCreated) onItemCreated();
  };

  const Icon = FaIcons[icon_name] || FaIcons.FaQuestion;

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
        {icons.map(i => <option key={i} value={i}>{i}</option>)}
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
