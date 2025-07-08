import { useState, useEffect, useCallback } from "react";
import {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from "../services/ingredientService";

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
