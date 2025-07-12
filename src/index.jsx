import React from 'react';
import ReactDOM from 'react-dom/client';

// Importación de estilos Bootstrap y Bootstrap Icons
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Estilos propios de la aplicación
import './index.css';


// Componente raíz de la aplicación
import App from './App';

// Función para medir rendimiento web (opcional)
import reportWebVitals from './reportWebVitals';

// Contexto de autenticación para proveer estado global de usuario
import { AuthProvider } from './contexts/AuthContext';

// Librería para hacer peticiones HTTP
import axios from 'axios'; 

// Estilos y componentes para notificaciones (toasts)
import 'bootstrap-icons/font/bootstrap-icons.css';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';



/**
 * Configuración global de Axios:
 * Se añade un interceptor para incluir automáticamente el token JWT almacenado en
 * localStorage en la cabecera Authorization de todas las peticiones HTTP salientes.
 */
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Creación del root para renderizar la aplicación React en el DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Proveedor de contexto para autenticación */}
    <AuthProvider>
      {/* Componente principal de la aplicación */}
      <App />
      {/* Contenedor para notificaciones tipo toast */}
      <ToastContainer position="top-right" autoClose={3000}/>
    </AuthProvider>
  </React.StrictMode>
);

// Función para medir y reportar métricas de rendimiento web
reportWebVitals();
