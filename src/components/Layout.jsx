import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logonavbar from "../assets/logo-navbar.png";
import '../Layout.css'; // Asegurate de tener este CSS

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { userProfile, logout } = useAuth();
  const location = useLocation();

  const [notifications, setNotificactions] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const {accessToken} = useAuth(); 

  // const token = localStorage.getItem("token"); 
  useEffect(() => {
    
    const fetchNotifications = async () => {
        try {
        //   const token = localStorage.getItem("token"); // ✅ leer siempre el valor actual
        // if (!token) {
        //   console.warn("Token no disponible para notificaciones");
        //   return;
        // }
        const response = await fetch("http://localhost:8000/core/stock-notifications/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setNotificactions(data);
        }
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      }
    };
  
    fetchNotifications();
  
    const interval = setInterval(fetchNotifications, 60000); // cada 60 segundos
    return () => clearInterval(interval);
  }, []);
  
  const handleResolveNotification = async (notifId) => {
    try {
      // const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/core/stock-notifications/${notifId}/resolve/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        setNotificactions((prev) => prev.filter((n) => n.id !== notifId));
      } else {
        console.error("Error al resolver notificación");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };
  

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const isActive = (path) => location.pathname === path;

  const isAdmin = userProfile?.groups?.includes("admin");
  const isKitchen = userProfile?.groups?.includes("cocina");
  const isAdminKitchen = userProfile?.groups?.includes("admin_cocina");
  const isSupervisor = userProfile?.groups?.includes("supervisor");

  const renderMenuItems = () => {
    const menuItems = [];

    if (isAdmin) {
      menuItems.push(
        <li key="users" className={isActive('/users') ? 'active' : ''}>
          <Link to="/users">
            <i className="bi bi-person-gear"></i>
            <span>Usuarios</span>
          </Link>
        </li>,
        <li key="shifts" className={isActive('/shifts') ? 'active' : ''}>
          <Link to="/shifts">
            <i className="bi bi-clock-history"></i>
            <span>Turnos</span>
          </Link>
        </li>,
        <li key="tickets-table" className={isActive('/tickets-table') ? 'active' : ''}>
          <Link to="/tickets-table">
            <i className="bi bi-table"></i>
            <span>Tabla de Tickets</span>
          </Link>
        </li>,
        <li key="reports" className={isActive('/reports') ? 'active' : ''}>
          <Link to="/reports">
            <i className="bi bi-bar-chart"></i>
            <span>Reportes</span>
          </Link>
        </li>
      );
    }

    if (isKitchen || isAdminKitchen) {
      menuItems.push(
        <li key="ticket-list" className={isActive('/ticket-list') ? 'active' : ''}>
          <Link to="/ticket-list">
            <i className="bi bi-list-ul"></i>
            <span>Lista de Tickets</span>
          </Link>
        </li>
      );
    }

    if (isAdminKitchen) {
      menuItems.push(
        <li key="menu" className={isActive('/menu') ? 'active' : ''}>
          <Link to="/menu">
            <i className="bi bi-journal-text"></i>
            <span>Menú</span>
          </Link>
        </li>
      );
    }

    if (isSupervisor) {
      menuItems.push(
        <li key="reports" className={isActive('/reports') ? 'active' : ''}>
          <Link to="/reports">
            <i className="bi bi-bar-chart"></i>
            <span>Reportes</span>
          </Link>
        </li>
      );
    }

    menuItems.push(
      <li key="ticket-validation" className={isActive('/ticket-validation') ? 'active' : ''}>
        <Link to="/ticket-validation">
          <i className="bi bi-upc-scan"></i>
          <span>Validar Ticket</span>
        </Link>
      </li>
    );

    return menuItems;
  };

  return (
    <div className="wrapper">
      <nav id="sidebar" className={`${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <img src={logonavbar} alt="Logo" className="img-fluid" />
        </div>
        
        <ul className="components">{renderMenuItems()}</ul>
        <div className="sidebar-footer text-center mt-auto mb-3" style={{fontSize: '0.8rem', color: '#888'}}>
            Powered By Aconcagua Code
          </div>
      </nav>

      <div id="content" className={sidebarCollapsed ? 'sidebar-collapsed' : ''}>
        <nav className={`navbar navbar-expand-lg bg-white shadow-sm px-3 fixed-top ${sidebarCollapsed ? 'collapsed-navbar' : ''}`}>
          <button
            type="button"
            className="btn toggle-btn"
            onClick={toggleSidebar}
          >
            <i className="bi bi-list"></i>
          </button>
          <div className="ms-auto d-flex align-items-center">


          <div className="position-relative me-3">
            <button
              className="btn btn-link position-relative"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            >
              <i className="bi bi-bell fs-5 text-dark"></i>
              {notifications.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="dropdown-menu dropdown-menu-end show p-2 shadow" style={{ minWidth: '300px', right: 0 }}>
                <h6 className="dropdown-header">Notificaciones</h6>
                {notifications.length === 0 ? (
                  <span className="dropdown-item-text text-muted">Sin notificaciones</span>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="dropdown-item-text small d-flex justify-content-between align-items-start">
                      <div style={{ maxWidth: '220px' }}>
                        <i className="bi bi-exclamation-circle-fill text-warning me-2"></i>
                        {notif.message}
                      </div>
                      <button
                        className="btn btn-sm btn-outline-success ms-2 py-0 px-1"
                        title="Marcar como leído"
                        onClick={() => handleResolveNotification(notif.id)}
                      >
                        <i className="bi bi-check2"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>



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
          
        </nav>

        <div className="container-fluid p-4">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
