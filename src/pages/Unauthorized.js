import React from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <Layout>
      <div className="container-fluid p-4">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="card">
              <div className="card-body">
                <h1 className="display-4 text-danger mb-4">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                </h1>
                <h2 className="card-title mb-4">Acceso Denegado</h2>
                <p className="card-text mb-4">
                  Lo sentimos, no tienes permisos para acceder a esta página.
                </p>
                <Link to="/" className="btn btn-primary">
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Unauthorized; 