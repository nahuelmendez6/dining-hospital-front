import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import LoginPin from './pages/LoginPin';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Departments from './pages/Departments';
import Reports from './pages/Reports';
import TicketGenerator from './pages/TicketGenerator';
import Unauthorized from './pages/Unauthorized';
import TicketPage from './pages/TicketPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/login-pin" element={<LoginPin />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* <Route path="/tickets" element={<TicketGenerator />} /> */}
          <Route path="/tickets" element={<TicketPage/>} />
          <Route path='/core' />

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
            path="/departments"
            element={
              <ProtectedRoute requiredGroups={['admin']}>
                <Departments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute requiredGroups={['admin']}>
                <Reports />
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 