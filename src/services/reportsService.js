import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/reports';

export const getTicketsLast7Days = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('No access token found.');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/tickets-last-7-days/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets last 7 days:', error);
    throw error;
  }
};

export async function getTicketCountByShift(token, date) {
    
  const response = await fetch(`${API_BASE_URL}/tickets/shift-count/?date=${date}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener tickets por turno');
  }

  return await response.json();
}

export const fetchStockMovements = async (filters, token) => {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/stock-movements/?${query}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Error al cargar el reporte de movimientos de stock');
    }
    return await response.json();
};

export const getTicketsByShift = async (params, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tickets-by-shift/`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching tickets by shift:', error);
    throw error;
  }
};

export const getItemConsumptionTrend = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/item-trends/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.results ?? response.data;
  } catch (error) {
    console.error('Error fetching item consumption trend:', error);
    throw error;
  }
};

export const getItemConsumptionByShift = async (params, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/item-consumption-by-shift/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return response.data.results || {};
  } catch (error) {
    console.error('Error fetching item consumption by shift:', error);
    throw error;
  }
};

export const getObservationsReport = async (params, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/observations-report/`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching observations report:', error);
    throw error;
  }
};

export const getItemConsumptionVsStock = async (params, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/item-consumption-vs-stock/`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching item consumption vs stock:', error);
    throw error;
  }
};

export const getStockEvaluationReport = async (params, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stock-evaluation-report/`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.results || [];
  } catch (err) {
    console.error('Error fetching stock evaluation report:', err);
    if (err.response) {
      throw new Error(`Error ${err.response.status}: ${err.response.data.detail || JSON.stringify(err.response.data)}`);
    } else if (err.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Error: ' + err.message);
    }
  }
};

export const getTicketSummary = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/summary/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket summary:', error);
    throw error;
  }
};

export const getStockDepletionForecast = async (params, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stock-depletion-forecast/`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.results || [];
  } catch (err) {
    console.error('Error fetching stock depletion forecast:', err);
    if (err.response) {
      throw new Error(`Error ${err.response.status}: ${err.response.data.detail || JSON.stringify(err.response.data)}`);
    } else if (err.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Error: ' + err.message);
    }
  }
};

export const getStockDepletionForecastReport = async (params, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stock-depletion-forecast/`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.results || [];
  } catch (err) {
    console.error('Error fetching stock depletion forecast report:', err);
    if (err.response) {
      throw new Error(`Error ${err.response.status}: ${err.response.data.detail || JSON.stringify(err.response.data)}`);
    } else if (err.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Error: ' + err.message);
    }
  }
};

export const getUserConsumptionReport = async (params, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user-consumption-report/`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.results || [];
  } catch (err) {
    console.error('Error fetching user consumption report:', err);
    if (err.response) {
      throw new Error(`Error ${err.response.status}: ${err.response.data.detail || JSON.stringify(err.response.data)}`);
    } else if (err.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Error: ' + err.message);
    }
  }
};

export const getTotalIngredientConsumptionReport = async (params, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ingredient-report/`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching total ingredient consumption report:', error);
    throw error;
  }
};

export const getMenuSimpleCostReport = async (params, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/menu-simple-cost/`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching menu simple cost report:', error);
    throw error;
  }
};