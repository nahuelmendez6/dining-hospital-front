import { useState, useEffect } from "react";

const groupIcons = {
  admin: "bi-person-badge",
  cocina: "bi-egg-fried",
  hospital: "bi-hospital",
  Default: "bi-people"
};

const UsersTable = ({ users, loading, onEdit, onDelete }) => {
  const [openGroups, setOpenGroups] = useState({});

  // Agrupar usuarios por su primer grupo
  const groupedUsers = users.reduce((acc, user) => {
    const groupName = user.groups?.[0] || "Sin grupo";
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(user);
    return acc;
  }, {});

  // Inicializar todos los grupos como cerrados por defecto
  useEffect(() => {
    const initialGroups = {};
    Object.keys(groupedUsers).forEach((group) => {
      initialGroups[group] = false;
    });
    setOpenGroups(initialGroups);
  }, [users]);

  const toggleGroup = (groupName) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (users.length === 0) {
    return <div className="text-center">No hay usuarios registrados</div>;
  }

  return (
    <div className="container">
      {Object.entries(groupedUsers).map(([groupName, groupUsers]) => {
        const isOpen = openGroups[groupName];
        const iconClass = groupIcons[groupName.toLowerCase()] || groupIcons.Default;

        return (
          <div key={groupName} className="mb-3">
            <div
              className="d-flex align-items-center justify-content-between bg-light p-2 rounded shadow-sm"
              style={{ cursor: "pointer" }}
              onClick={() => toggleGroup(groupName)}
            >
              <h6 className="mb-0 text-capitalize">
                <i className={`bi ${iconClass} me-2`}></i>
                {groupName}
              </h6>
              <i className={`bi ${isOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
            </div>

            {isOpen && (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 mt-2">
                {groupUsers.map((user) => (
                  <div key={user.id} className="col">
                    <div className="card shadow-sm h-100 p-2">
                      <div className="card-body p-2">
                        <h6 className="card-title mb-1">{user.first_name} {user.last_name}</h6>
                        <p className="card-text small mb-2">
                          <strong>Email:</strong> {user.email}<br />
                          <strong>Departamento:</strong> {user.department?.name || "N/A"}
                        </p>
                        <div className="d-flex justify-content-end gap-1">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(user)}>
                            <i className="bi bi-pencil" /> Editar
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(user)}>
                            <i className="bi bi-trash" /> Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UsersTable;
