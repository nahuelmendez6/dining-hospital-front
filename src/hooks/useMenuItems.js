import { useState, useEffect } from "react";
import { getMenuItems, deleteMenuItem } from "../services/menuService";
import { toast } from "react-toastify";

/**
 * Hook personalizado para gestionar los ítems de menú.
 * Proporciona funciones para obtener, eliminar y actualizar la lista de ítems.
 * 
 * @param {string} token - Token de autenticación para las operaciones protegidas.
 * @returns {Object} {
 *   items: Array de ítems de menú,
 *   fetchItems: Función para recargar los ítems desde el backend,
 *   removeItem: Función para eliminar un ítem por id,
 *   setItems: Función para actualizar manualmente el estado de los ítems,
 * }
 */
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
