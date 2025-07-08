import axios from "axios";

const API_URL = "http://localhost:8000/core/ingredients/";

export const getIngredients = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createIngredient = async (ingredient, token) => {
  const response = await axios.post(API_URL, ingredient, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateIngredient = async (id, ingredient, token) => {
  const response = await axios.patch(`${API_URL}${id}/`, ingredient, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteIngredient = async (id, token) => {
  await axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};