import React from 'react';
import { Spinner, Alert, Table, Button } from 'react-bootstrap';
import { BiEdit, BiTrash, BiX } from 'react-icons/bi';

const ShiftsTable = ({ shifts, loading, error, onEdit, onDelete }) => {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body table-responsive">
        {error && <Alert variant="danger">{error}</Alert>}
        {loading && !shifts.length ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table hover striped responsive className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Hora de Inicio</th>
                <th>Hora de Fin</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {shifts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    <BiX size={24} className="me-2" />
                    No hay turnos registrados
                  </td>
                </tr>
              ) : (
                shifts.map((shift) => (
                  <tr key={shift.id}>
                    <td>{shift.id}</td>
                    <td>{shift.name}</td>
                    <td>{shift.start_time}</td>
                    <td>{shift.end_time}</td>
                    <td className="text-center">
                      <Button variant="warning" size="sm" className="me-2" onClick={() => onEdit(shift)}>
                        <BiEdit />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => onDelete(shift.id)}>
                        <BiTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ShiftsTable;
