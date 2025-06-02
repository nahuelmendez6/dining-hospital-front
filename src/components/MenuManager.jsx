import { useEffect, useState } from "react";
import axios from "axios";
import MenuItemForm from "./MenuItemForm";
import MenuList from "./MenuList";
import Layout from "./Layout";

const API_URL = 'http://localhost:8000/';

function MenuManager() {
  const [items, setItems] = useState([]);

  const[editingItem, setEditingItem] = useState(null);


  const fetchItems = async () => {
    const res = await axios.get(`${API_URL}core/menu-items/`);
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleItemCreated = async () => {
    await fetchItems(); // Refrescar lista al crear nuevo ítem
  };


  /*
    por ahora solo editar, despues vemos el eliminar

  */
    const handleItemUpdated = async (id, updatedItem) => {
      try {
        const token = localStorage.getItem('accessToken');
        console.log('Token enviado:', token);
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        console.log('Headers', headers)
        await axios.patch(
          `${API_URL}core/edit/menu-item/${id}/`,
          updatedItem,
          { headers }
        );
        setEditingItem(null);
        fetchItems();
      } catch (error) {
        console.error("Error updating item:", error.response || error);
      }
    };

  return (

      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Gestión de Menú</h2>
        <MenuItemForm
          initialItem={editingItem}
          onSubmit={editingItem ? (item) => handleItemUpdated(editingItem.id, item) : handleItemCreated}
          onCancel={() => setEditingItem(null)}
        />
        <MenuList
          items={items}
          onEdit={setEditingItem}
        />
      </div>

  );
}

export default MenuManager;
