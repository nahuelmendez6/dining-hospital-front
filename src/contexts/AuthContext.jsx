import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);           // Perfil completo del usuario
  const [userProfile, setUserProfile] = useState(null); // Mismo objeto perfil, redundante pero cómodo
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

  const API_URL = 'http://localhost:8000';

  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const loadUserData = async (token) => {
    try {
      console.log('Cargando datos del usuario...');
      const decodedToken = decodeToken(token);
      if (!decodedToken) return false;

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
        const profile = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          department_id: userData.department_id,
          groups: userData.groups || []
        };
        console.log('Perfil cargado:', profile);

        setUser(profile);
        setUserProfile(profile);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading user data:', error);
      return false;
    }
  };

  const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded) return true;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        setAccessToken(data.access);
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
            setLoading(false);
            return;
          }
        }

        const success = await loadUserData(localStorage.getItem('accessToken'));
        if (!success) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setAccessToken(null);
          setUser(null);
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
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
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      console.log('Respuesta del servidor:', response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Credenciales inválidas');
      }

      const data = await response.json();

      if (data.access && data.refresh) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        setAccessToken(data.access);

        const success = await loadUserData(data.access);
        if (success) {
          return true;
        } else {
          throw new Error('Error al cargar la información del usuario');
        }
      } else {
        throw new Error('No se recibieron los tokens necesarios');
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const loginWithPin = async (pin) => {
    try {
      console.log('Iniciando login con PIN...');
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      console.log('Respuesta del servidor:', response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'PIN inválido');
      }

      const data = await response.json();

      if (data.access && data.refresh) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        setAccessToken(data.access);

        const success = await loadUserData(data.access);
        if (success) {
          return true;
        } else {
          throw new Error('Error al cargar la información del usuario');
        }
      } else {
        throw new Error('No se recibieron los tokens necesarios');
      }
    } catch (error) {
      console.error('Error en login con PIN:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setUser(null);
    setUserProfile(null);
  };

  // Funciones para grupos
  const isInGroup = (groupName) => {
    if (!userProfile || !userProfile.groups) return false;
    return userProfile.groups.includes(groupName);
  };

  const isInAnyGroup = (groupNames) => {
    if (!userProfile || !userProfile.groups) return false;
    return groupNames.some(groupName => userProfile.groups.includes(groupName));
  };

  const isInAllGroups = (groupNames) => {
    if (!userProfile || !userProfile.groups) return false;
    return groupNames.every(groupName => userProfile.groups.includes(groupName));
  };

  const value = {
    user,
    userProfile,
    loading,
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
