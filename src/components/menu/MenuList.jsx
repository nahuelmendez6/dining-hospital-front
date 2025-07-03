import * as FaIcons from "react-icons/fa";
import { foodIcons } from "../../icons/foodIcons";
import './styles/CategorySidebar.css';


// Etiquetas visibles por categoría
const CATEGORY_LABELS = {
  drink_hot: "Bebidas Calientes",
  drink_cold: "Bebidas Frías",
  bakery: "Panificados y Repostería",
  fruit: "Frutas",
  dairy: "Lácteos y Untables",
  snack: "Snacks",
  main_course: "Platos Principales",
  combo: "Menús Armados / Ejecutivos",
  dessert: "Postres",
  other: "Otros",
};

// Estilos Bootstrap (o personalizados) por categoría
const CATEGORY_STYLES = {
  drink_hot: "text-danger",
  drink_cold: "text-info",
  bakery: "text-warning",
  fruit: "text-success",
  dairy: "text-primary",
  snack: "text-secondary",
  main_course: "text-dark",
  combo: "text-muted",
  dessert: "text-pink", // clase custom si querés
  other: "text-body",
};

function MenuList({ items, onEdit, onRemove, onDelete }) {
  // Agrupar ítems por categoría
  const groupedItems = items.reduce((acc, item) => {
    const cat = item.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categoryKeys = Object.keys(groupedItems);

  if (categoryKeys.length === 0) {
    return <p className="text-center">No hay ítems asignados.</p>;
  }

  return (
    <div className="row mt-4" style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Sidebar de categorías */}
      <div className="col-md-3 mb-4">
        <div className="list-group sticky-top category-sidebar">
          {categoryKeys.map((cat) => (
            <a
              key={cat}
              href={`#cat-${cat}`}
              className={`list-group-item list-group-item-action ${CATEGORY_STYLES[cat] || ""}`}
            >
              {CATEGORY_LABELS[cat] || cat}
            </a>
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="col-md-9">
        {categoryKeys.map((cat) => (
          <div key={cat} className="mb-5" id={`cat-${cat}`}>
            <h5 className={`fw-bold mb-3 ${CATEGORY_STYLES[cat] || ""}`}>
              {CATEGORY_LABELS[cat] || "Sin Categoría"}
            </h5>

            <table className="table table-sm table-striped table-hover">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Ícono</th>
                  <th>Stock</th>
                  <th>Stock mínimo</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {groupedItems[cat].map((item) => {
                  const Icon = foodIcons[item.icon_name] || FaIcons.FaUtensils;
                  return (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td><Icon /></td>
                      <td>{item.stock}</td>
                      <td>{item.min_stock}</td>
                      <td className="text-end">
                        {onEdit && (
                          <button
                            className="btn btn-outline-primary btn-sm me-1"
                            onClick={() => onEdit(item)}
                          >
                            Editar
                          </button>
                        )}
                        {onDelete && (
                          <button
                            className="btn btn-outline-danger btn-sm me-1"
                            onClick={() => onDelete(item.id)}
                          >
                            Eliminar
                          </button>
                        )}
                        {onRemove && (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => onRemove(item.id)}
                          >
                            Quitar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuList;
