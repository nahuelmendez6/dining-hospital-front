import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import DepartmentFormModal from '../components/DepartmentFormModal';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  // Load departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Check if user has access to this page
  useEffect(() => {
    if (userProfile?.department?.id !== 1) {
      navigate('/unauthorized');
    }
  }, [userProfile, navigate]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/departments/');
      setDepartments(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los departamentos');
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setShowModal(true);
  };

  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setShowModal(true);
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este departamento?')) {
      try {
        await axios.delete(`/api/departments/${departmentId}/`);
        await fetchDepartments(); // Refresh the list
      } catch (err) {
        console.error('Error deleting department:', err);
        alert('Error al eliminar el departamento');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedDepartment) {
        // Update existing department
        await axios.put(`/api/departments/${selectedDepartment.id}/`, formData);
      } else {
        // Create new department
        await axios.post('/api/departments/', formData);
      }
      await fetchDepartments(); // Refresh the list
      setShowModal(false);
    } catch (err) {
      console.error('Error saving department:', err);
      alert('Error al guardar el departamento');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Departamentos</h2>
        <button className="btn btn-primary" onClick={handleAddDepartment}>
          <i className="bi bi-plus-lg"></i> Nuevo Departamento
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
                  <th>Descripción</th>
                  <th>Empleados</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {departments.length > 0 ? (
                  departments.map((department) => (
                    <tr key={department.id}>
                      <td>{department.id}</td>
                      <td>{department.name}</td>
                      <td>{department.description}</td>
                      <td>{department.employee_count || 0}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEditDepartment(department)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteDepartment(department.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No hay departamentos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DepartmentFormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        department={selectedDepartment}
      />
    </Layout>
  );
};

export default Departments; 