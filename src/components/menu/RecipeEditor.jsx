import React, { useEffect, useState } from "react";
import { getIngredients } from "../../services/ingredientService";
import {
  getRecipeIngredients,
  addRecipeIngredient,
  deleteRecipeIngredient,
} from "../../services/recipeService";

function RecipeEditor({ menuItemId }) {
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState([]);
  const [selectedIngredientId, setSelectedIngredientId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!menuItemId) return;

    setLoading(true);
    getIngredients()
      .then(setIngredients)
      .finally(() => setLoading(false));

    getRecipeIngredients(menuItemId).then((data) => {
      if (Array.isArray(data)) setRecipe(data);
      else if (data.results && Array.isArray(data.results)) setRecipe(data.results);
      else setRecipe([]);
    });
  }, [menuItemId]);

  const handleAdd = async () => {
    if (!selectedIngredientId || !quantity || quantity <= 0) return;

    await addRecipeIngredient(menuItemId, {
      ingredient_id: selectedIngredientId,
      quantity: parseFloat(quantity),
    });

    const updated = await getRecipeIngredients(menuItemId);
    setRecipe(updated);
    setQuantity("");
  };

  const handleDelete = async (id) => {
    await deleteRecipeIngredient(id);
    setRecipe((r) => r.filter((item) => item.id !== id));
  };

  return (
    <div className="mt-3">
      <h5 className="mb-3">Receta del Ítem</h5>

      {recipe.length === 0 ? (
        <p className="text-muted fst-italic">No hay ingredientes en la receta.</p>
      ) : (
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Ingrediente</th>
              <th>Cantidad</th>
              <th>Unidad</th>
              <th className="text-center" style={{ width: 100 }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {recipe.map((r) => (
              <tr key={r.id}>
                <td>{r.ingredient.name}</td>
                <td>{r.quantity}</td>
                <td>{r.ingredient.unit}</td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(r.id)}
                    title="Quitar ingrediente"
                  >
                    &times;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="row g-2 align-items-end">
        <div className="col-md-6">
          <label htmlFor="ingredientSelect" className="form-label">
            Ingrediente
          </label>
          <select
            id="ingredientSelect"
            className="form-select"
            value={selectedIngredientId}
            onChange={(e) => setSelectedIngredientId(e.target.value)}
          >
            <option value="">Seleccionar...</option>
            {ingredients.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} ({i.unit})
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label htmlFor="quantityInput" className="form-label">
            Cantidad
          </label>
          <input
            id="quantityInput"
            type="number"
            min="0.01"
            step="0.01"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Ej: 0.5"
          />
        </div>
        <div className="col-md-2 d-grid">
          <button
            className="btn btn-success"
            onClick={handleAdd}
            disabled={!selectedIngredientId || !quantity || quantity <= 0}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeEditor;
