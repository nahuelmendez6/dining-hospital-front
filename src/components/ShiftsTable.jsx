import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import {
  getShifts,
  createShift,
  editShift,
  deleteShift,
} from '../services/shiftService';

const ShiftsTable = () => {
  const { accessToken: token } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [form, setForm] = useState({ name: '', start_time: '', end_time: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchShifts = async () => {
    try {
      if (!token) return;
      const data = await getShifts(token);
      console.log("Turnos recibidos desde API:", data);
      setShifts(data);
    } catch (error) {
      console.error('Error al obtener los turnos:', error);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await editShift(editingId, form, token);
      } else {
        await createShift(form, token);
      }
      setForm({ name: '', start_time: '', end_time: '' });
      setEditingId(null);
      fetchShifts();
    } catch (error) {
      console.error('Error al guardar el turno:', error);
    }
  };

  // const handleEdit = (shift) => {
  //   setForm({ name: shift.name, start_time: shift.start_time, end_time: shift.end_time });
  //   setEditingId(shift.id);
  // };
  const handleEdit = (shift) => {
    setForm({
      name: shift.name ?? '',
      start_time: shift.start_time ?? '',
      end_time: shift.end_time ?? '',
    });
    setEditingId(shift.id);
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este turno?')) return;
    try {
      await deleteShift(id, token);
      fetchShifts();
    } catch (error) {
      console.error('Error al eliminar el turno:', error);
    }
  };

  return (
    <Layout>
      <div className="container-fluid p-4">
        <h2 className="mb-4">
          <i className="bi bi-clock-history me-2"></i>Gestión de Turnos
        </h2>

        <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow-sm">
          <h5>{editingId ? 'Editar Turno' : 'Crear Turno'}</h5>
          <div className="row">
            <div className="col-md-3">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Nombre"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="time"
                name="start_time"
                className="form-control"
                value={form.start_time}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="time"
                name="end_time"
                className="form-control"
                value={form.end_time}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3 d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setForm({ name: '', start_time: '', end_time: '' });
                    setEditingId(null);
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="card shadow-sm border-0">
          <div className="card-body table-responsive">
            <table className="table table-hover table-striped align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Hora de Inicio</th>
                  <th>Hora de Fin</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {shifts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      <i className="bi bi-exclamation-circle me-2"></i>No hay turnos
                    </td>
                  </tr>
                ) : (
                  shifts.map((shift) => (
                    <tr key={shift.id}>
                      <td>{shift.id}</td>
                      <td>{shift.name}</td>
                      <td>{shift.start_time}</td>
                      <td>{shift.end_time}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(shift)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(shift.id)}
                        >
                          Eliminar
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
    </Layout>
  );
};

export default ShiftsTable;
