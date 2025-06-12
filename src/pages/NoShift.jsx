import React from 'react';
import { Link } from 'react-router-dom';

const NoShift = () => {
  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-5 text-center">
              <h2 className="mb-4">Turnos No Disponibles</h2>
              <p className="fs-5 text-muted">
                No hay turnos disponibles en este momento. <br />
                Intenta más tarde.
              </p>
              <div className="mt-4">
                <Link to="/" className="btn btn-outline-primary">
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoShift;
