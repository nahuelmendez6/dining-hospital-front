import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext';
import axios from 'axios'; 

import 'bootstrap-icons/font/bootstrap-icons.css';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';



// Configurar interceptor global para agregar el token JWT a todas las peticiones
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <ToastContainer position="top-right" autoClose={3000}/>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
