import axios from 'axios';

const API_URL = 'http://localhost:8000/reports/stock-movements/'; // Ajusta la ruta si es necesario

export const fetchStockMovements = async (filters, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: filters
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};
