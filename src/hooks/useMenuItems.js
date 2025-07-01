import { useState, useEffect } from "react";
import { getMenuItems, deleteMenuItem } from "../services/menuService";
import { toast } from "react-toastify";

export function useMenuItems(token) {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const data = await getMenuItems();
      setItems(data);
    } catch (error) {
      toast.error("Error al cargar ítems de menú");
    }
  };

  const removeItem = async (id) => {
    try {
      await deleteMenuItem(id, token);
      toast.success("Ítem eliminado");
      await fetchItems();
    } catch (error) {
      toast.error("Error al eliminar ítem");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    fetchItems,
    removeItem,
    setItems,
  };
}
