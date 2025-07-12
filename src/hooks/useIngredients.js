import { useState, useEffect, useCallback } from "react";
import {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from "../services/ingredientService";

/**
 * Hook personalizado para gestionar el listado de ingredientes y operaciones CRUD relacionadas.
 * 
 * @param {string} token - Token de autenticación para las peticiones a la API.
 * 
 * @returns {Object} Un objeto con:
 *  - ingredients: Array con los ingredientes cargados.
 *  - error: Mensaje de error, si ocurre alguno.
 *  - addIngredient: Función para crear un nuevo ingrediente.
 *  - editIngredient: Función para actualizar un ingrediente existente.
 *  - removeIngredient: Función para eliminar un ingrediente.
 *  - setError: Setter para modificar manualmente el error.
 * 
 * El hook automáticamente carga los ingredientes al montar el componente o cuando cambia el token.
 * Las funciones CRUD actualizan la lista automáticamente tras completarse.
 */
export const useIngredients = (token) => {
  const [ingredients, setIngredients] = useState([]);
  const [error, setError] = useState(null);

  const fetchIngredients = useCallback(async () => {
    try {
      const data = await getIngredients(token);
      setIngredients(data);
    } catch (err) {
      console.error("Error al cargar ingredientes:", err);
      setError("Error al cargar ingredientes.");
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchIngredients();
    }
  }, [token, fetchIngredients]);

  const addIngredient = async (ingredient) => {
    try {
      await createIngredient(ingredient, token);
      fetchIngredients();
    } catch (err) {
      console.error(err);
      setError("Error al guardar ingrediente. Verifica los datos ingresados.");
    }
  };

  const editIngredient = async (id, ingredient) => {
    try {
      await updateIngredient(id, ingredient, token);
      fetchIngredients();
    } catch (err) {
      console.error(err);
      setError("Error al actualizar ingrediente. Verifica los datos ingresados.");
    }
  };

  const removeIngredient = async (id) => {
    try {
      await deleteIngredient(id, token);
      fetchIngredients();
    } catch (err) {
      console.error(err);
      setError("Error al eliminar ingrediente.");
    }
  };

  return { ingredients, error, addIngredient, editIngredient, removeIngredient, setError };
};
