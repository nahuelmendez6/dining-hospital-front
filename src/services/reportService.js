
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/reports/';

export async function getTicketCountByShift(token, date) {
    
    const response = await fetch(`${API_URL}tickets/shift-count/?date=${date}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Error al obtener tickets por turno');
    }
  
    return await response.json();
  }
  