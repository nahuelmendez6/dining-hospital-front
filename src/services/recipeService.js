import axios from "axios";

const BASE_URL = "http://localhost:8000/core";

export const getRecipeIngredients = async (menuItemId) => {
  const res = await axios.get(`${BASE_URL}/menu-items/${menuItemId}/recipe/`);
  return res.data;
};

export const addRecipeIngredient = async (menuItemId, data) => {
  const res = await axios.post(`${BASE_URL}/menu-items/${menuItemId}/recipe/`, data);
  return res.data;
};

export const updateRecipeIngredient = async (id, data) => {
  const res = await axios.put(`${BASE_URL}/recipe-ingredient/${id}/`, data);
  return res.data;
};

export const deleteRecipeIngredient = async (id) => {
  const res = await axios.delete(`${BASE_URL}/recipe-ingredient/${id}/`);
  return res.data;
};
