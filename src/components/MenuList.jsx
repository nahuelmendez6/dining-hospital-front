import * as FaIcons from "react-icons/fa";

function MenuList({ items, onEdit, onDelete }) {
  return (
    <div className="row">
      {items.map((item) => {
        const Icon = FaIcons[item.icon_name] || FaIcons.FaQuestion;

        return (
          <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body d-flex flex-column align-items-center">
                <div className="display-4 mb-2 text-primary">
                  <Icon />
                </div>
                <h5 className="card-title mb-1">{item.name}</h5>
                <p className="text-muted mb-3">Stock: {item.stock}</p>

                <div className="mt-auto">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => onEdit(item)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(item.id)}
                    title="Eliminar"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MenuList;
