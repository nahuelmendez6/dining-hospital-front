import React from 'react';
import Layout from '../components/Layout';

const Reports = () => {
  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Reportes</h2>
      </div>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Reporte de Tickets</h5>
              <p className="card-text">Generar reporte de tickets por período</p>
              <button className="btn btn-primary">Generar Reporte</button>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Reporte de Usuarios</h5>
              <p className="card-text">Generar reporte de usuarios por departamento</p>
              <button className="btn btn-primary">Generar Reporte</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports; 