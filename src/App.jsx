import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import LoginPin from './pages/LoginPin';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Unauthorized from './pages/Unauthorized';
import TicketPage from './pages/TicketPage';
import TicketListPage from './pages/TicketListPage';
import Layout from './components/Layout';
import TicketsPage from './pages/TicketsPage';
import MenuManagerPage from './pages/MenuManagerPage';
import ShiftsPage from './pages/Shifts';

import Reports from './pages/Reports';

import AuthTest from './components/test/AuthTest';

import 'bootstrap-icons/font/bootstrap-icons.css';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import './App.css'

import TestRef from './components/TestRef';


/**
 * Componente principal de la aplicación.
 * Configura las rutas públicas y protegidas, envolviendo toda la app con AuthProvider y Router.
 *
 * Rutas públicas:
 * - /login: Página para login con usuario y contraseña.
 * - /login-pin: Página para login con PIN.
 * - /unauthorized: Página de acceso denegado.
 * - /tickets: Página pública para generación de tickets.
 * - /test: Página de prueba.
 *
 * Rutas protegidas por grupos:
 * - Cocina y admin_cocina:
 *   - /ticket-list: Lista de tickets para cocina.
 *   - /menu: Gestión del menú.
 * - Admin:
 *   - /users: Gestión de usuarios.
 *   - /tickets-table: Visualización de tickets en tabla.
 *   - /shifts: Gestión de turnos.
 * - Admin y supervisor:
 *   - /reports: Página de reportes.
 *
 * Ruta protegida para todos usuarios autenticados:
 * - /dashboard: Dashboard principal.
 *
 * Redirecciona la raíz "/" y rutas no encontradas "*" a /dashboard.
 *
 * Incluye contenedor de notificaciones (ToastContainer).
 *
 * @returns {JSX.Element} La estructura de rutas de la aplicación.
 */

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/login-pin" element={<LoginPin />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path='/test' element={<TestRef />} />
          {/* <Route path="/tickets" element={<TicketGenerator />} /> */}
          <Route path="/tickets" element={<TicketPage/>} />
          <Route path='/core' />

          {/* Rutas para personal de cocina */}
          <Route
            path="/ticket-list"
            element={
              <ProtectedRoute requiredGroups={['cocina', 'admin_cocina']}>
                <Layout>
                  <TicketListPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/menu"
            element={
              <ProtectedRoute requiredGroups={['cocina', 'admin_cocina']}>
                <Layout>
                  <MenuManagerPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas para administradores */}
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredGroups={['admin']}>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets-table"
            element={
              <ProtectedRoute requiredGroups={['admin']}>
                <TicketsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shifts"
            element={
              <ProtectedRoute requiredGroups={['admin']}>
                <ShiftsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute requiredGroups={['admin', 'supervisor']}>
                <Reports/>
              </ProtectedRoute>
            }
          />

          {/* Ruta del dashboard (accesible por todos los usuarios autenticados) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirigir la ruta raíz al dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Ruta para manejar URLs no encontradas */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
            
          <Route path="/test-auth" element={<AuthTest />} />
 
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App; 