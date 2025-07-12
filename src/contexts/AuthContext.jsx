import React, { createContext, useContext, useState, useEffect } from 'react';


/**
 * Contexto de autenticación que provee el estado y funciones para login, logout y manejo de usuario.
 */
const AuthContext = createContext(null);


/**
 * Hook para consumir el contexto de autenticación.
 * @returns {Object} El contexto de autenticación.
 */
export const useAuth = () => useContext(AuthContext);


/**
 * Proveedor de contexto para autenticación.
 * Maneja el estado del usuario, tokens, y funciones para login/logout.
 *
 * @param {React.ReactNode} children - Componentes hijos que consumirán el contexto.
 * @returns {JSX.Element} Provider con el contexto de autenticación.
 */
export const AuthProvider = ({ children }) => {
  
  // Estado para el usuario y perfil de usuario (puede ser redundante, pero útil)
  const [user, setUser] = useState(null);           // Perfil completo del usuario
  const [userProfile, setUserProfile] = useState(null); // Mismo objeto perfil, redundante pero cómodo
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

  const API_URL = 'http://localhost:8000';


  /**
   * Decodifica un JWT para obtener su payload.
   * @param {string} token - Token JWT.
   * @returns {Object|null} Payload decodificado o null si hay error.
   */
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

   /**
   * Carga la información del usuario desde la API usando el token.
   * @param {string} token - Token de acceso válido.
   * @returns {Promise<boolean>} true si carga con éxito, false en caso contrario.
   */
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



  /**
   * Verifica si un token JWT está expirado.
   * @param {string} token - Token JWT.
   * @returns {boolean} true si está expirado, false si es válido.
   */
  const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded) return true;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  };


  /**
   * Intenta refrescar el token de acceso usando el refresh token almacenado.
   * @returns {Promise<boolean>} true si refresca con éxito, false si falla.
   */
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


  /**
   * Efecto que inicializa la autenticación al montar el provider.
   * Verifica token, lo refresca si es necesario y carga datos del usuario.
   */
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


  /**
   * Función para iniciar sesión con usuario y contraseña.
   * @param {string} username
   * @param {string} password
   * @returns {Promise<boolean>} true si login exitoso, lanza error si falla.
   */
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


  /**
   * Función para iniciar sesión con un PIN (alternativa).
   * @param {string} pin
   * @returns {Promise<boolean>} true si login exitoso, lanza error si falla.
   */
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


  /**
   * Función para cerrar sesión, eliminando tokens y datos del usuario.
   */
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setUser(null);
    setUserProfile(null);
  };

  /**
   * Verifica si el usuario pertenece a un grupo específico.
   * @param {string} groupName - Nombre del grupo.
   * @returns {boolean} true si pertenece, false si no.
   */

  const isInGroup = (groupName) => {
    if (!userProfile || !userProfile.groups) return false;
    return userProfile.groups.includes(groupName);
  };


  /**
   * Verifica si el usuario pertenece a alguno de los grupos indicados.
   * @param {string[]} groupNames - Lista de nombres de grupos.
   * @returns {boolean} true si pertenece a alguno, false si no.
   */
  const isInAnyGroup = (groupNames) => {
    if (!userProfile || !userProfile.groups) return false;
    return groupNames.some(groupName => userProfile.groups.includes(groupName));
  };  


   /**
   * Verifica si el usuario pertenece a todos los grupos indicados.
   * @param {string[]} groupNames - Lista de nombres de grupos.
   * @returns {boolean} true si pertenece a todos, false si no.
   */
  const isInAllGroups = (groupNames) => {
    if (!userProfile || !userProfile.groups) return false;
    return groupNames.every(groupName => userProfile.groups.includes(groupName));
  };

  // Objeto con valores y funciones del contexto
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


  // Renderiza el Provider y muestra los hijos solo si no está cargando
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
