import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { getDepartments } from '../services/userService'; // Ajusta la ruta si es necesario
import { useAuth } from '../contexts/AuthContext';  // <-- Importar el contexto
import Layout from '../components/Layout';


export default function DepartmentDashboard() {
  const { accessToken: token } = useAuth();  // <-- Obtener token del contexto
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: null, name: '' });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (!token) return;  // <-- Esperar a que el token esté disponible

    const fetchDepartments = async () => {
      try {
        const data = await getDepartments(token);
        setDepartments(data);
      } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al obtener los departamentos');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [token]); // <-- Agregar token como dependencia

  const openModal = (dept = null) => {
    if (dept) {
      setForm(dept);
      setIsEdit(true);
    } else {
      setForm({ id: null, name: '' });
      setIsEdit(false);
    }
    const modal = new window.bootstrap.Modal(document.getElementById('departmentModal'));
    modal.show();
  };

  const handleSave = () => {
    // TODO: Implementar lógica de guardado con la API
    console.log(isEdit ? 'Actualizar departamento:' : 'Crear nuevo departamento:', form);
  };

  const handleDelete = (id) => {
    // TODO: Implementar lógica de eliminación con la API
    console.log('Eliminar departamento con ID:', id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <Layout>
        <div className="container my-5">
      <h2 className="mb-4">Gestión de Departamentos</h2>
      <button className="btn btn-success mb-4" onClick={() => openModal()}>+ Agregar Departamento</button>

      {loading ? (
        <p>Cargando departamentos...</p>
      ) : (
        <div className="row g-4">
          {departments.map(dept => (
            <div className="col-md-4" key={dept.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{dept.name}</h5>
                </div>
                <div className="card-footer d-flex justify-content-end gap-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => openModal(dept)}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(dept.id)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <div className="modal fade" id="departmentModal" tabIndex="-1" aria-labelledby="departmentModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="departmentModalLabel">{isEdit ? 'Editar Departamento' : 'Nuevo Departamento'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </div>
      </div>
        </div>
    </Layout>
  );
}
