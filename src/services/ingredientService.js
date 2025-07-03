// src/services/ingredientService.js
import axios from "axios";

const BASE_URL = "http://localhost:8000/core";

export const getIngredients = async () => {
  const response = await axios.get(`${BASE_URL}/ingredients/`);
  return response.data;
};
