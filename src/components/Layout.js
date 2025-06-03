import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, userProfile, logout } = useAuth();
  const location = useLocation();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isAdmin = userProfile?.department?.id === 1;
  const isKitchen = userProfile?.department?.id === 3;

  const renderMenuItems = () => {
    const menuItems = [];

    // Admin menu items (department.id = 1)
    if (isAdmin) {
      menuItems.push(
        <li key="users" className={isActive('/users') ? 'active' : ''}>
          <Link to="/users" className="d-flex align-items-center p-3 text-white">
            <i className="bi bi-person-gear me-2"></i>
            Usuarios
          </Link>
        </li>,
        <li key="departments" className={isActive('/departments') ? 'active' : ''}>
          <Link to="/departments" className="d-flex align-items-center p-3 text-white">
            <i className="bi bi-building me-2"></i>
            Departamentos
          </Link>
        </li>,
        <li key="tickets-table" className={isActive('/tickets-table') ? 'active' : ''}>
          <Link to="/tickets-table" className="d-flex align-items-center p-3 text-white">
            <i className="bi bi-table me-2"></i>
            Tabla de Tickets
          </Link>
        </li>,
        <li key="tickets" className={isActive('/tickets') ? 'active' : ''}>
          <Link to="/tickets" className="d-flex align-items-center p-3 text-white">
            <i className="bi bi-ticket-perforated me-2"></i>
            Gestión de Tickets
          </Link>
        </li>,
        <li key="menu" className={isActive('/menu') ? 'active' : ''}>
          <Link to="/menu" className="d-flex align-items-center p-3 text-white">
            <i className="bi bi-journal-text me-2"></i>
            Menú
          </Link>
        </li>,
        <li key="reports" className={isActive('/reports') ? 'active' : ''}>
          <Link to="/reports" className="d-flex align-items-center p-3 text-white">
            <i className="bi bi-bar-chart me-2"></i>
            Reportes
          </Link>
        </li>
      );
    }

    // Kitchen menu items (department.id = 3)
    if (isKitchen) {
      menuItems.push(
        <li key="ticket-list" className={isActive('/ticket-list') ? 'active' : ''}>
          <Link to="/ticket-list" className="d-flex align-items-center p-3 text-white">
            <i className="bi bi-list-ul me-2"></i>
            Lista de Tickets
          </Link>
        </li>
      );
    }

    // Common menu items for all users
    menuItems.push(
      <li key="ticket-validation" className={isActive('/ticket-validation') ? 'active' : ''}>
        <Link to="/ticket-validation" className="d-flex align-items-center p-3 text-white">
          <i className="bi bi-upc-scan me-2"></i>
          Validar Ticket
        </Link>
      </li>
    );

    return menuItems;
  };

  return (
    <div className="wrapper">
      {/* Sidebar */}
      <nav id="sidebar" className={`bg-dark text-white ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header p-3">
          <h3>Comedor Hospital</h3>
        </div>

        <ul className="list-unstyled components">
          {renderMenuItems()}
        </ul>
      </nav>

      {/* Page Content */}
      <div id="content" className={sidebarCollapsed ? 'sidebar-collapsed' : ''}>
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
                {userProfile?.department && (
                  <small className="ms-2 text-muted">
                    ({userProfile.department.name})
                  </small>
                )}
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