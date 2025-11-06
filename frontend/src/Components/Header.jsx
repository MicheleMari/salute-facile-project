// frontend/src/Components/Header.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-light shadow-sm mb-4">
      <nav className="container navbar navbar-expand-lg navbar-light">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          SaluteFacile.it
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="navbar-text me-3">Ciao, {user.nome}!</span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/medici">Trova un Medico</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/appuntamenti">I Miei Appuntamenti</Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-secondary btn-sm">Logout</button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-primary" to="/login">Accedi o Registrati</Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;