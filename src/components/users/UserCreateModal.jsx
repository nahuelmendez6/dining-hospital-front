import { useEffect, useState } from "react";
import { getObservations } from "../../services/userService";
import { useAuth } from "../../contexts/AuthContext";

import { getGroups } from "../../services/groupService";

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

const UserCreateModal = ({ isOpen, onClose, onSubmit }) => {
  const { accessToken: token } = useAuth();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    confirm_email: '',
    dni: '',
    group: '',
    observations: [],
  });


  const [groupOptions, setGroupOptions] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getGroups(token);
        setGroupOptions(data);
      } catch (error) {
        console.error("Error al cargar grupos", error.response?.data || error.message);
      }
    };

    if (isOpen) fetchGroups();
  }, [isOpen, token]);



  const [observationOptions, setObservationOptions] = useState([]);

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const data = await getObservations(token);
        setObservationOptions(data);
      } catch (error) {
        console.error("Error al cargar observaciones");
      }
    };

    if (isOpen) fetchObservations();
  }, [isOpen, token]);

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
              <h5 className="modal-title">Nuevo Usuario</h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>

            <div className="modal-body p-4 bg-white">
              {/* Datos personales */}
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
                <h6 className="text-primary mb-3">Observaciones</h6>
                {observationOptions.length === 0 ? (
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
              <button type="submit" className="btn btn-primary">Guardar</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserCreateModal;
