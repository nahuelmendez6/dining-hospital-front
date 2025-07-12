import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/reports';

/**
 * Obtiene la cantidad de tickets emitidos en los últimos 7 días.
 * Usa el token guardado en localStorage.
 * 
 * @returns {Promise<Object[]>} Lista de conteos diarios.
 * @throws {Error} Si no hay token o la petición falla.
 */
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


/**
 * Obtiene la cantidad de tickets emitidos por turno para una fecha específica.
 * 
 * @param {string} token - Token de autenticación.
 * @param {string} date - Fecha en formato YYYY-MM-DD.
 * @returns {Promise<Object>} Conteo por turno.
 */
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


/**
 * Obtiene los movimientos de stock filtrados por parámetros.
 * 
 * @param {Object} filters - Filtros para la consulta (ej: fecha, ítem).
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object[]>} Lista de movimientos de stock.
 */
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



/**
 * Obtiene tickets agrupados por turno según parámetros pasados (fecha, turno, etc).
 * 
 * @param {Object} params - Parámetros de búsqueda.
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object[]>} Lista de tickets.
 */
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


/**
 * Obtiene la tendencia de consumo por ítem (usado para gráficos).
 * 
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object[]>} Lista de ítems con su evolución de consumo.
 */
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


/**
 * Obtiene el consumo de ítems desglosado por turno.
 * 
 * @param {Object} params - Parámetros de búsqueda (fecha, ítem, etc).
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object>} Datos agregados por turno.
 */
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


/**
 * Obtiene reporte de observaciones realizadas (sugerencias, incidencias, etc).
 * 
 * @param {Object} params - Filtros del reporte.
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object[]>} Lista de observaciones agrupadas.
 */
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


/**
 * Compara el consumo de ítems con el stock disponible.
 * 
 * @param {Object} params - Filtros (fecha, ítem, etc).
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object[]>} Datos de comparación ítem/stock.
 */
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


/**
 * Obtiene evaluación del stock actual (cantidades, faltantes, etc).
 * 
 * @param {Object} params - Filtros para el reporte.
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object[]>} Resultados de evaluación del stock.
 */
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


/**
 * Obtiene un resumen general de emisión de tickets.
 * 
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object>} Resumen de tickets (totales, por turno, por usuario, etc).
 */
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


/**
 * Obtiene una proyección de agotamiento de stock según el ritmo de consumo actual.
 * 
 * @param {Object} params - Parámetros de filtro.
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object[]>} Proyección por ítem (día estimado de agotamiento).
 */
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


/**
 * Reporte detallado de agotamiento de stock, similar al anterior pero enfocado en descarga.
 * 
 * @param {Object} params - Parámetros para la generación del reporte.
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object[]>} Resultados del reporte.
 */
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


/**
 * Reporte de consumo por usuario (ideal para auditoría o seguimiento).
 * 
 * @param {Object} params - Parámetros de búsqueda (usuario, fecha, etc).
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object[]>} Resultados agrupados por usuario.
 */
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


/**
 * Reporte de consumo total de ingredientes por período.
 * 
 * @param {Object} params - Filtros (fechas, ingredientes, etc).
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object[]>} Datos agregados de consumo.
 */
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


/**
 * Reporte de costo simple de menú (valor estimado según ingredientes).
 * 
 * @param {Object} params - Filtros para fecha o menú.
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object[]>} Costo estimado por menú.
 */
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