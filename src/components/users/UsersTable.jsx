import { useState } from "react";

const groupIcons = {
  admin: "bi-person-badge",
  cocina: "bi-egg-fried",
  hospital: "bi-hospital",
  Default: "bi-people"
};

const UsersTable = ({ users, loading, onEdit }) => {
  const [openGroups, setOpenGroups] = useState({});

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

  // Agrupar usuarios por su primer grupo (string)
  const groupedUsers = users.reduce((acc, user) => {
    const groupName = user.groups?.[0] || "Sin grupo";
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(user);
    return acc;
  }, {});

  const toggleGroup = (groupName) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  return (
    <div className="container">
      {Object.entries(groupedUsers).map(([groupName, groupUsers]) => {
        const isOpen = openGroups[groupName] ?? true;
        const iconClass = groupIcons[groupName.toLowerCase()] || groupIcons.Default;

        return (
          <div key={groupName} className="mb-4">
            <div
              className="d-flex align-items-center justify-content-between bg-light p-2 rounded shadow-sm"
              style={{ cursor: "pointer" }}
              onClick={() => toggleGroup(groupName)}
            >
              <h5 className="mb-0 text-capitalize">
                <i className={`bi ${iconClass} me-2`}></i>
                {groupName}
              </h5>
              <i className={`bi ${isOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
            </div>

            {isOpen && (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-2">
                {groupUsers.map((user) => (
                  <div key={user.id} className="col">
                    <div className="card shadow-sm h-100">
                      <div className="card-body">
                        <h5 className="card-title">
                          {user.first_name} {user.last_name}
                        </h5>
                        <p className="card-text">
                          <strong>Email:</strong> {user.email}<br />
                          <strong>Departamento:</strong> {user.department?.name || "N/A"}
                        </p>
                        <div className="d-flex justify-content-end gap-2">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(user)}>
                            <i className="bi bi-pencil"></i> Editar
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i> Eliminar
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
