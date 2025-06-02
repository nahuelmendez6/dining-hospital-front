import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, userProfile, logout } = useAuth();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="wrapper">
      {/* Sidebar */}
      <nav id="sidebar" className={`bg-dark text-white ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header p-3">
          <h3>Comedor Hospital</h3>
        </div>

        <ul className="list-unstyled components">
          <li className={isActive('/users') ? 'active' : ''}>
            <Link to="/users" className="d-flex align-items-center p-3 text-white">
              <i className="bi bi-people-fill me-2"></i>
              Usuarios
            </Link>
          </li>
          <li className={isActive('/users') ? 'active' : ''}>
            <Link to="/departments" className="d-flex align-items-center p-3 text-white">
              <i className="bi bi-people me-2"></i>
              Departamentos
            </Link>
          </li>
          <li className={isActive('/ticket-list') ? 'active' : ''}>
            <Link to="/tickets-table" className="d-flex align-items-center p-3 text-white">
              <i className="bi bi-card-list me-2"></i>
              Lista de tickets
            </Link>
          </li>
          <li className={isActive('/ticket-list') ? 'active' : ''}>
            <Link to="/ticket-list" className="d-flex align-items-center p-3 text-white">
              <i className="bi bi-people-fill me-2"></i>
              Tickets
            </Link>
          </li>

          <li className={isActive('/tickets') ? 'active' : ''}>
            <Link to="/tickets" className="d-flex align-items-center p-3 text-white">
              <i className="bi bi-ticket-perforated-fill me-2"></i>
              Tickets
            </Link>
          </li>
          <li className={isActive('/shifts') ? 'active' : ''}>
            <Link to="/shifts" className="d-flex align-items-center p-3 text-white">
              <i className="bi bi-clock-fill me-2"></i>
              Turnos
            </Link>
          </li>
          <li className={isActive('/reports') ? 'active' : ''}>
            <Link to="/menu" className="d-flex align-items-center p-3 text-white">
              <i className="bi bi-graph-up me-2"></i>
              Menu
            </Link>
          </li>
          <li className={isActive('/reports') ? 'active' : ''}>
            <Link to="/reports" className="d-flex align-items-center p-3 text-white">
              <i className="bi bi-graph-up me-2"></i>
              Reportes
            </Link>
          </li>
          <li className={isActive('/ticket-validation') ? 'active' : ''}>
            <Link to="/ticket-validation" className="d-flex align-items-center p-3 text-white">
              <i className="bi bi-upc-scan me-2"></i>
              Validar Ticket
            </Link>
          </li>
        </ul>
      </nav>

      {/* Page Content */}
      <div id="content">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
          <div className="container-fluid">
            <button type="button" id="sidebarCollapse" className="btn btn-dark" onClick={toggleSidebar}>
              <i className="bi bi-list"></i>
            </button>
            <div className="ms-auto d-flex align-items-center">
              <span className="me-3 text-dark">
                <i className="bi bi-person-circle me-2"></i>
                {userProfile?.first_name && userProfile?.last_name 
                  ? `${userProfile.first_name} ${userProfile.last_name}`
                  : userProfile?.username || 'Usuario'}
              </span>
              <button className="btn btn-outline-danger btn-sm" onClick={logout}>
                <i className="bi bi-box-arrow-right"></i> Salir
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container-fluid p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout; 