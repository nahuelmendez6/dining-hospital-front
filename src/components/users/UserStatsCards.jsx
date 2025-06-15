import React, { useContext, useEffect, useState } from "react";
import { getUserStats } from "../../services/userSerive";
import AuthContext from "../../contexts/AuthContext";

const iconMap = {
  admin: "bi-person-badge",
  cocina: "bi-egg-fried",
  hospital: "bi-hospital",
  default: "bi-people"
};

const groupColors = {
  admin: 'bg-warning text-dark',
  cocina: 'bg-success text-white',
  hospital: 'bg-danger text-white',

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
      <div className="text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!stats) return <div>Error cargando datos</div>;

  const { total, active, unactive, user_group } = stats;

  return (
    <div className="container">
      {/* Métricas generales */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 mb-4">
        <div className="col">
          <div className="card text-bg-primary shadow-sm text-center">
            <div className="card-body">
              <i className="bi bi-people fs-1 mb-2" />
              <h5 className="card-title">Usuarios totales</h5>
              <p className="fs-4">{total}</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card text-bg-success shadow-sm text-center">
            <div className="card-body">
              <i className="bi bi-check-circle fs-1 mb-2" />
              <h5 className="card-title">Activos</h5>
              <p className="fs-4">{active}</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card text-bg-secondary shadow-sm text-center">
            <div className="card-body">
              <i className="bi bi-x-circle fs-1 mb-2" />
              <h5 className="card-title">Inactivos</h5>
              <p className="fs-4">{unactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas por grupo */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
        {Object.entries(user_group).map(([group, count]) => {
          const iconClass = iconMap[group] || iconMap.default;

          return (
            <div className="col" key={group}>
              <div className={`card shadow-sm text-center ${groupColors[group] || groupColors.default}`}>
                <div className="card-body">
                  <i className={`bi ${iconClass} fs-1 mb-2`} />
                  <h6 className="card-title text-capitalize">{group}</h6>
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
