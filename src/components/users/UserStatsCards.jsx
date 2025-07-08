import React, { useContext, useEffect, useState } from "react";
import { getUserStats } from "../../services/userService";
import AuthContext from "../../contexts/AuthContext";



const iconMap = {
  admin: "bi-person-badge",
  cocina: "bi-egg-fried",
  comensal: "bi-person-circle",
  default: "bi-people"
};

const groupColors = {
  admin: 'bg-warning text-dark',       // amarillo oscuro
  cocina: 'bg-success text-white',     // verde
  comensal: 'bg-danger text-white',    // rojo
  supervisor: 'bg-dark text-white', // gris oscuro
  admin_cocina: 'bg-info text-dark',   // azul claro
};

export default function UserStatsCards() {
  const { accessToken } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getUserStats(accessToken)
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar estadísticas de usuarios", err);
        setLoading(false);
      });
  }, [accessToken]);

  if (loading) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!stats) return <div>Error cargando datos</div>;

  const { total, active, unactive, user_group } = stats;

  return (
    <div className="container">
      {/* Métricas generales */}
      <div className="row row-cols-1 row-cols-md-3 g-2 mb-3">
        <div className="col">
          <div className="card text-bg-primary shadow-sm text-center p-2">
            <div className="card-body p-2">
              <i className="bi bi-people fs-3 mb-1" />
              <h6 className="card-title mb-1">Usuarios totales</h6>
              <p className="fs-5 mb-0">{total}</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card text-bg-success shadow-sm text-center p-2">
            <div className="card-body p-2">
              <i className="bi bi-check-circle fs-3 mb-1" />
              <h6 className="card-title mb-1">Activos</h6>
              <p className="fs-5 mb-0">{active}</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card text-bg-secondary shadow-sm text-center p-2">
            <div className="card-body p-2">
              <i className="bi bi-x-circle fs-3 mb-1" />
              <h6 className="card-title mb-1">Inactivos</h6>
              <p className="fs-5 mb-0">{unactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas por grupo */}
      <div className="row row-cols-1 row-cols-md-3 g-2">
        {Object.entries(user_group).map(([group, count]) => {
          const iconClass = iconMap[group] || iconMap.default;

          return (
            <div className="col" key={group}>
              <div className={`card shadow-sm text-center p-2 ${groupColors[group] || groupColors.default}`}>
                <div className="card-body p-2">
                  <i className={`bi ${iconClass} fs-3 mb-1`} />
                  <h6 className="card-title text-capitalize mb-1">{group}</h6>
                  <p className="fs-5 mb-0">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
