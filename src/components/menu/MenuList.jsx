import * as FaIcons from "react-icons/fa";
import { foodIcons } from "../../icons/foodIcons";

function MenuList({ items, onEdit, onRemove, onDelete }) {
  return (
    <div className="mt-4" style={{ maxWidth: 800, margin: '0 auto' }}>
      <h5>Ítems asignados</h5>

      {items.length === 0 ? (
        <p>No hay ítems asignados.</p>
      ) : (
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
                  <td>
                    <Icon />
                  </td>
                  <td>{item.stock}</td>
                  <td className="text-end">
                    {onEdit && (
                      <button
                        className="btn btn-outline-primary btn-sm me-1"
                        onClick={() => onEdit(item)}
                        type="button"
                      >
                        Editar
                      </button>
                    )}
                    
                    {onDelete && (
                        <button
                          className="btn btn-outline-danger btn-sm me-1"
                          onClick={() => onDelete(item.id)}
                          type="button"
                        >
                          Eliminar
                        </button>
                      )}
                    {onRemove && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => onRemove(item.id)}
                        type="button"
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
      )}
    </div>
  );
}

export default MenuList;
