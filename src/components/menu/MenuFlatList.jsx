import * as FaIcons from "react-icons/fa";
import { foodIcons } from "../../icons/foodIcons";

function MenuFlatList({ items, onEdit, onRemove, onDelete }) {
  if (!items || items.length === 0) {
    return <p className="text-center">No hay ítems disponibles.</p>;
  }

  return (
    <div className="table-responsive mt-4">
      <table className="table table-sm table-striped table-hover">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ícono</th>
            <th>Stock</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const Icon = foodIcons[item.icon_name] || FaIcons.FaUtensils;
            return (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td><Icon /></td>
                <td>{item.stock}</td>
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
  );
}

export default MenuFlatList;
