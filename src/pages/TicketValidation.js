import React from 'react';
import Layout from '../components/Layout';

const TicketValidation = () => {
  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Validación de Tickets</h2>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Escanear Ticket</h5>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingrese el código del ticket"
                />
              </div>
              <button className="btn btn-primary">Validar Ticket</button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Últimos Tickets Validados</h5>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Ticket</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="3" className="text-center">No hay tickets validados</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TicketValidation; 