import { useEffect, useState } from 'react';
import { useUserForm } from '../../hooks/useUserForm'; // 1. Importamos el nuevo hook

import {
  FaLeaf, FaCandyCane, FaOilCan, FaBreadSlice, FaFish,
} from "react-icons/fa";
import {
  GiSprout, GiWheat, GiAcorn, GiShrimp, GiMilkCarton,
  GiEggClutch, GiCow, GiCoffeeCup, GiChemicalDrop, GiMuscleUp,
} from "react-icons/gi";
import {
  MdFavorite, MdLocalHospital, MdNoFood, MdRestaurantMenu, MdWarning,
} from "react-icons/md";

const iconMap = {
  FaLeaf, GiSprout, GiWheat, MdFavorite, MdLocalHospital,
  GiAcorn, GiShrimp, GiMilkCarton, GiEggClutch, MdNoFood,
  FaCandyCane, FaOilCan, FaBreadSlice, FaFish, GiCow,
  MdRestaurantMenu, GiCoffeeCup, GiMuscleUp, MdWarning, GiChemicalDrop,
};

const UserFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const isEditing = !!initialData; // 2. Determinamos si estamos en modo edición

  // 3. Usamos el hook para obtener los datos del formulario
  const { groupOptions, observationOptions, loading: dataLoading, error: dataError } = useUserForm(isOpen);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    confirm_email: '',
    dni: '',
    group: '',
    observations: [],
  });

  // 4. Efecto para inicializar o resetear el estado del formulario
  useEffect(() => {
    if (isOpen) {
      if (isEditing && initialData) {
        // Si estamos editando, poblamos el formulario con los datos iniciales
        setFormData({
          first_name: initialData.first_name || '',
          last_name: initialData.last_name || '',
          email: initialData.email || '',
          confirm_email: initialData.email || '', // Pre-llenamos para conveniencia
          dni: initialData.dni || '',
          group: initialData.groups?.[0]?.name || '', // Asumimos que el grupo es un objeto en un array
          observations: initialData.observations?.map(obs => obs.id) || [], // Extraemos los IDs
        });
      } else {
        // Si estamos creando, reseteamos el formulario
        setFormData({ first_name: '', last_name: '', email: '', confirm_email: '', dni: '', group: '', observations: [] });
      }
    }
  }, [isOpen, isEditing, initialData]);

  if (!isOpen) return null;

  // Manejo genérico de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Para observations, aseguramos que sea siempre un array
    if (name === 'observations') {
      setFormData(prev => ({
        ...prev,
        [name]: Array.isArray(value) ? value : [],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Para toggle de observaciones (array de ids)
  const toggleObservation = (id) => {
    setFormData(prev => {
      const exists = prev.observations.includes(id);
      const newObservations = exists
        ? prev.observations.filter(obsId => obsId !== id)
        : [...prev.observations, id];
      return {
        ...prev,
        observations: newObservations,
      };
    });
  };

  const emailsDoNotMatch = formData.confirm_email && formData.email !== formData.confirm_email;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (emailsDoNotMatch) {
      alert("Los correos electrónicos no coinciden.");
      return;
    }

    // Enviar solo los datos, no el evento
    onSubmit({
      id: initialData?.id,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      dni: formData.dni,
      group: formData.group,
      observations: formData.observations,
    });
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content rounded-3 shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="modal-header bg-primary text-white">
              {/* 5. Título dinámico */}
              <h5 className="modal-title">{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>

            <div className="modal-body p-4 bg-white">
              {dataError && <div className="alert alert-danger">{dataError}</div>}
              <div className="border rounded p-3 mb-4 bg-light">
                <h6 className="text-primary">Datos personales</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Apellido</label>
                    <input
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">DNI</label>
                    <input
                      name="dni"
                      value={formData.dni}
                      onChange={handleChange}
                      className="form-control"
                      pattern="\d*"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Datos de acceso */}
              <div className="border rounded p-3 mb-4 bg-light">
                <h6 className="text-primary">Datos de acceso</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Confirmar Email</label>
                    <input
                      name="confirm_email"
                      type="email"
                      value={formData.confirm_email}
                      onChange={handleChange}
                      className={`form-control ${emailsDoNotMatch ? 'is-invalid' : ''}`}
                      required
                    />
                    {emailsDoNotMatch && (
                      <div className="invalid-feedback">Los correos no coinciden</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Grupo</label>
                    {/* <select
                      name="group"
                      value={formData.group}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Seleccione un grupo...</option>
                      <option value="admin">Administrador</option>
                      <option value="hospital">Hospital</option>
                      <option value="cocina">Cocina</option>
                    </select> */}
                    <select
                      name="group"
                      value={formData.group}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Seleccione un grupo...</option>
                      {groupOptions.map(group => (
                        <option key={group.id} value={group.name}>{group.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              <div className="border rounded p-3 bg-light">
                <h6 className="text-primary mb-3">Observaciones Dietéticas</h6>
                {dataLoading ? (
                  <div className="text-muted">Cargando observaciones...</div>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {observationOptions.map((obs) => {
                      const IconComponent = iconMap[obs.icon_name] || MdWarning;
                      const isActive = formData.observations.includes(obs.id);

                      return (
                        <button
                          type="button"
                          key={obs.id}
                          className={`btn btn-sm d-flex align-items-center ${isActive ? 'btn-success' : 'btn-outline-secondary'}`}
                          onClick={() => toggleObservation(obs.id)}
                        >
                          <IconComponent className="me-1" />
                          {obs.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              {/* 6. Botón dinámico */}
              <button type="submit" className="btn btn-primary">{isEditing ? 'Actualizar Cambios' : 'Guardar Usuario'}</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;
