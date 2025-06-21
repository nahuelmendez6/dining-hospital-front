import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredGroups = [] }) => {
  const { user, userProfile, isInAnyGroup } = useAuth();

  // 1. Si no hay usuario autenticado o perfil, redirigir a login
  if (!user || !userProfile) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si la ruta requiere grupos específicos, validar pertenencia
  if (requiredGroups.length > 0) {
    const hasAccess = isInAnyGroup(requiredGroups);
    
    console.log("Usuario:", userProfile?.username);
    console.log("Grupos del usuario:", userProfile?.groups);
    console.log("Grupos requeridos:", requiredGroups);
    console.log("¿Tiene acceso?:", hasAccess);

    if (!hasAccess) {
      // Si el usuario pertenece al grupo 'hospital', redirigir a tickets
      if (isInAnyGroup(['hospital'])) {
        return <Navigate to="/tickets" replace />;
      }
      // Si no, ruta no autorizada
      return <Navigate to="/unauthorized" replace />;
    }
  } else {
    // Si no se requiere ningún grupo, dejamos pasar el acceso
    console.log("Usuario:", userProfile?.username);
    console.log("Ruta sin restricción de grupo. Acceso permitido.");
  }

  // 3. Retornar el componente hijo si todo está OK
  return children;
};

export default ProtectedRoute;
