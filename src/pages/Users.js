import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { createUser, getDepartments, getUsers } from '../services/userSerive';
import { useAuth } from '../contexts/AuthContext';

const Users = () => {
  const [showModal, setShowModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    department: '',
    dni: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        console.error("No hay token de autenticación");
        return;
      }
      try {
        setLoading(true);
        console.log('Iniciando fetch de datos...');
        
        // Fetch departments
        console.log('Obteniendo departamentos...');
        const departmentsData = await getDepartments(accessToken);
        console.log('Departamentos obtenidos:', departmentsData);
        if (Array.isArray(departmentsData)) {
          setDepartments(departmentsData);
        } else if (departmentsData && departmentsData.departments) {
          setDepartments(departmentsData.departments);
        }

        // Fetch users
        console.log('Obteniendo usuarios...');
        const usersData = await getUsers(accessToken);
        console.log('Usuarios obtenidos:', usersData);
        setUsers(usersData);
      } catch (error) {
        console.error("Error al obtener datos:", error.message);
        if (error.response) {
          console.error("Detalles del error:", {
            status: error.response.status,
            data: error.response.data
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value.trim()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.lastname || !formData.email || !formData.department || !formData.dni) {
      alert('Por favor, complete todos los campos requeridos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Por favor, ingrese un email válido');
      return;
    }

    const dniRegex = /^\d+$/;
    if (!dniRegex.test(formData.dni)) {
      alert('Por favor, ingrese un DNI válido (solo números)');
      return;
    }

    try {
      console.log('Datos del formulario antes de enviar:', formData);
      const response = await createUser(formData, accessToken);
      
      if (response.data) {
        alert('Usuario creado exitosamente');
        setShowModal(false);
        setFormData({
          name: '',
          lastname: '',
          email: '',
          department: '',
          dni: ''
        });
        // Refresh users list after creating a new user
        const usersData = await getUsers(accessToken);
        setUsers(Array.isArray(usersData) ? usersData : []);
      }
    } catch (error) {
      console.error('Error en la creación del usuario:', error);
      let errorMessage = 'Error al crear el usuario. ';
      
      try {
        const errorData = JSON.parse(error.message);
        if (typeof errorData === 'object') {
          if (errorData.detail) {
            errorMessage += errorData.detail;
          } else if (errorData.message) {
            errorMessage += errorData.message;
          } else {
            const errorDetails = Object.entries(errorData)
              .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
              .join('\n');
            errorMessage += '\n' + errorDetails;
          }
        } else {
          errorMessage += error.message;
        }
      } catch {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
    }
  };

  return (
    <Layout>
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Gestión de Usuarios</h2>
          <button 
            className="btn btn-primary btn-lg" 
            onClick={() => setShowModal(true)}
            style={{ minWidth: '200px' }}
          >
            <i className="bi bi-plus-lg me-2"></i>
            Nuevo Usuario
          </button>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Email</th>
                    <th>Departamento</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">No hay usuarios registrados</td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.email}</td>
                        <td>{user.department?.name || 'N/A'}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal de Creación de Usuario */}
        {showModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Nuevo Usuario</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese el nombre"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Apellido</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese el apellido"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">DNI</label>
                      <input
                        type="text"
                        className="form-control"
                        name="dni"
                        value={formData.dni}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese el DNI (solo números)"
                        pattern="\d*"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="ejemplo@correo.com"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Departamento</label>
                      <select
                        className="form-select"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccione un departamento...</option>
                        {departments && departments.length > 0 ? (
                          departments.map(dep => (
                            <option key={dep.id} value={dep.id}>
                              {dep.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>No hay departamentos disponibles</option>
                        )}
                      </select>
                      {departments.length === 0 && (
                        <small className="text-muted">Cargando departamentos...</small>
                      )}
                    </div>
                    <div className="modal-footer">
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setShowModal(false)}
                      >
                        Cancelar
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Guardar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {showModal && <div className="modal-backdrop fade show"></div>}
      </div>
    </Layout>
  );
};

export default Users; 