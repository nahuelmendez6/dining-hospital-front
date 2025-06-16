import { useEffect, useState } from "react";
import { getObservations } from "../../services/userService";
import { useAuth } from "../../contexts/AuthContext";
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

const UserCreateModal = ({ isOpen, onClose, onChange, onSubmit, formData }) => {
  const [observationOptions, setObservationOptions] = useState([]);
  const { accessToken: token } = useAuth();

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
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content rounded-3 shadow-lg">
          <form onSubmit={onSubmit}>
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Nuevo Usuario</h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>

            <div className="modal-body p-4 bg-white">
              {/* Sección 1: Datos personales */}
              <div className="border rounded p-3 mb-4 bg-light">
                <h6 className="text-primary">Datos personales</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nombre</label>
                    <input name="first_name" value={formData.first_name} onChange={onChange} className="form-control" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Apellido</label>
                    <input name="last_name" value={formData.last_name} onChange={onChange} className="form-control" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">DNI</label>
                    <input name="dni" value={formData.dni} onChange={onChange} className="form-control" pattern="\d*" required />
                  </div>
                </div>
              </div>

              {/* Sección 2: Datos de acceso */}
              <div className="border rounded p-3 mb-4 bg-light">
                <h6 className="text-primary">Datos de acceso</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input name="email" type="email" value={formData.email} onChange={onChange} className="form-control" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Grupo</label>
                    <select name="group" value={formData.group} onChange={onChange} className="form-select" required>
                      <option value="">Seleccione un grupo...</option>
                      <option value="admin">Administrador</option>
                      <option value="hospital">Hospital</option>
                      <option value="cocina">Cocina</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sección 3: Observaciones */}
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
                          onClick={() => {
                            const newObservations = isActive
                              ? formData.observations.filter((id) => id !== obs.id)
                              : [...formData.observations, obs.id];

                            onChange({
                              target: {
                                name: "observations",
                                value: newObservations,
                              },
                            });
                          }}
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
