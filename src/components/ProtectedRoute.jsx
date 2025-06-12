import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredGroups = [] }) => {
  const { user, userProfile, isInAnyGroup } = useAuth();

  // Si no hay usuario autenticado, redirigir al login
  if (!user || !userProfile) {
    return <Navigate to="/login" replace />;
  }

  // Si se requieren grupos específicos
  if (requiredGroups.length > 0) {
    // Si el usuario no está en ninguno de los grupos requeridos
    if (!isInAnyGroup(requiredGroups)) {
      // Si el usuario está en el grupo 'hospital', redirigir a la página de tickets
      if (isInAnyGroup(['hospital'])) {
        return <Navigate to="/tickets" replace />;
      }
      // Para otros usuarios, redirigir a una página de acceso denegado
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Si el usuario está autenticado y tiene los permisos necesarios
  return children;
};

export default ProtectedRoute; 