// services/departmentService.js
const API_URL = 'http://localhost:8000/'

export async function getDepartments(token) {
  const response = await fetch(`${API_URL}core/list-departments`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, // o 'Token' si usás TokenAuth
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error al obtener departamentos:', response.status, errorText);
    throw new Error('Error al obtener departamentos');
  }

  return await response.json();
}
