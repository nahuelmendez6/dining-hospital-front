import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

  // URL base de la API de Django
  const API_URL = 'http://localhost:8000';

  // Función para decodificar el token JWT
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Función para cargar la información del usuario
  const loadUserData = async (token) => {
    try {
      console.log('Cargando datos del usuario...');
      
      // Intentar obtener la información del usuario del token primero
      const decodedToken = decodeToken(token);
      console.log('Token válido, cargando datos del usuario');

      // Si no hay información en el token, intentar obtenerla del endpoint
      const response = await fetch(`${API_URL}/auth/user/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Respuesta del servidor:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('Datos del usuario cargados correctamente');
        
        // Crear un objeto de perfil con la información necesaria
        const profile = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          groups: userData.groups || []
        };
        
        setUserProfile(profile);
        setGroups(profile.groups);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading user data:', error);
      return false;
    }
  };

  // Función para verificar si el token ha expirado
  const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  };

  // Función para refrescar el token
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        if (isTokenExpired(token)) {
          const refreshed = await refreshToken();
          if (!refreshed) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setAccessToken(null);
            setUser(null);
            setUserProfile(null);
            setGroups([]);
            setLoading(false);
            return;
          }
        }
        
        const success = await loadUserData(token);
        if (success) {
          setUser({ isAuthenticated: true });
          setAccessToken(token);
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setAccessToken(null);
          setUser(null);
          setUserProfile(null);
          setGroups([]);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const loginWithCredentials = async (username, password) => {
    try {
      console.log('Iniciando proceso de login...');
      
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

     
      
      console.log('Respuesta del servidor:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.detail || 'Credenciales inválidas');
      }

      const data = await response.json();
      console.log('Login exitoso, configurando sesión');


      if (data.access && data.refresh) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        setAccessToken(data.access);
        
        // Cargar la información del usuario después del login
        const success = await loadUserData(data.access);
        if (success) {
          setUser({ isAuthenticated: true });
          return true;
        } else {
          throw new Error('Error al cargar la información del usuario');
        }
      } else {
        throw new Error('No se recibieron los tokens necesarios');
      }
    } catch (error) {
      console.error('Error en login:', error);
      if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
        throw new Error('Error de conexión con el servidor. Por favor, verifica que el servidor esté en ejecución.');
      }
      throw error;
    }
  };

  const loginWithPin = async (pin) => {
    try {
      console.log('Iniciando login con PIN...');
      
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ pin })
      });

      console.log('Respuesta del servidor:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.detail || 'PIN inválido');
      }

      const data = await response.json();
      console.log('Login exitoso, configurando sesión');

      if (data.access && data.refresh) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        setAccessToken(data.access);
        
        // Cargar la información del usuario después del login
        const success = await loadUserData(data.access);
        if (success) {
          setUser({ isAuthenticated: true });
          return true;
        } else {
          throw new Error('Error al cargar la información del usuario');
        }
      } else {
        throw new Error('No se recibieron los tokens necesarios');
      }
    } catch (error) {
      console.error('Error en login con PIN:', error);
      if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
        throw new Error('Error de conexión con el servidor. Por favor, verifica que el servidor esté en ejecución.');
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setUser(null);
    setUserProfile(null);
    setGroups([]);
  };

  // Función para verificar si el usuario pertenece a un grupo específico
  const isInGroup = (groupName) => {
    return groups.includes(groupName);
  };

  // Función para verificar si el usuario pertenece a cualquiera de los grupos especificados
  const isInAnyGroup = (groupNames) => {
    return groupNames.some(groupName => groups.includes(groupName));
  };

  // Función para verificar si el usuario pertenece a todos los grupos especificados
  const isInAllGroups = (groupNames) => {
    return groupNames.every(groupName => groups.includes(groupName));
  };

  const value = {
    user,
    loading,
    groups,
    userProfile,
    accessToken,
    loginWithCredentials,
    loginWithPin,
    logout,
    isInGroup,
    isInAnyGroup,
    isInAllGroups,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;