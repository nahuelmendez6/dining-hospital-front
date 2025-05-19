import React from 'react';
import Layout from '../components/Layout';

const TicketView = () => {
  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Vista de Ticket</h2>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title mb-4">Ticket #12345</h5>
              <div className="mb-4">
                <img
                  src="https://via.placeholder.com/200"
                  alt="QR Code"
                  className="img-fluid"
                />
              </div>
              <div className="mb-3">
                <p className="mb-1"><strong>Usuario:</strong> Juan Pérez</p>
                <p className="mb-1"><strong>Departamento:</strong> Enfermería</p>
                <p className="mb-1"><strong>Fecha:</strong> 01/01/2024</p>
                <p className="mb-1"><strong>Estado:</strong> <span className="badge bg-success">Válido</span></p>
              </div>
              <button className="btn btn-primary">Imprimir Ticket</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TicketView; 