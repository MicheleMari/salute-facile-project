// frontend/src/Components/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Home() {
  const { user } = useAuth();

  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">Benvenuto in SaluteFacile.it</h1>
      <p className="lead">La tua salute, a portata di click. Prenota una visita specialistica in modo semplice e veloce.</p>
      <hr className="my-4" />
      {user ? (
        <Link className="btn btn-primary btn-lg" to="/medici">Cerca un Medico</Link>
      ) : (
        <Link className="btn btn-primary btn-lg" to="/login">Inizia Subito</Link>
      )}
    </div>
  );
}

export default Home;