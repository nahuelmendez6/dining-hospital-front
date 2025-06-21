import React from 'react';
import { useAuth } from "../../contexts/AuthContext";

const AuthTest = () => {
  const { userProfile, isInAnyGroup } = useAuth();

  if (!userProfile) {
    return <div>No hay usuario cargado (no autenticado)</div>;
  }

  return (
    <div>
      <h2>Test de Autenticación y Grupos</h2>
      <p><strong>Usuario:</strong> {userProfile.username}</p>
      <p><strong>Grupos del usuario:</strong> {userProfile.groups.join(', ') || '(ninguno)'}</p>

      <div style={{ marginTop: '20px' }}>
        <p>¿Pertenece a grupo 'admin'?: {isInAnyGroup(['admin']) ? 'Sí' : 'No'}</p>
        <p>¿Pertenece a grupo 'cocina'?: {isInAnyGroup(['cocina']) ? 'Sí' : 'No'}</p>
        <p>¿Pertenece a grupo 'admin_cocina'?: {isInAnyGroup(['admin_cocina']) ? 'Sí' : 'No'}</p>
        <p>¿Pertenece a alguno de ['admin', 'cocina']?: {isInAnyGroup(['admin', 'cocina']) ? 'Sí' : 'No'}</p>
        <p>¿Pertenece a alguno de ['inexistente', 'otro']?: {isInAnyGroup(['inexistente', 'otro']) ? 'Sí' : 'No'}</p>
      </div>
    </div>
  );
};

export default AuthTest;
