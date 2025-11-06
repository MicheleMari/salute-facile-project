// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import DoctorsList from './components/DoctorsList';
import DoctorDetail from './components/DoctorDetail';
import MyBookings from './components/MyBookings';
import ProtectedRoute from './components/ProtectedRoute';

// Un componente semplice per la Home
function Home() {
  return (
    <div className="container mt-5">
      <h1>Benvenuto su HealthBooker!</h1>
      <p>Il tuo portale per le prenotazioni mediche online.</p>
      <Link to="/medici" className="btn btn-primary">Visualizza Medici</Link>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Controlla se l'utente è già loggato all'avvio
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div>
<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">HealthBooker</Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {user && (
                <li className="nav-item">
                  <Link className="nav-link" to="/medici">Medici</Link>
                </li>
              )}
            </ul>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {user ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/appuntamenti">I Miei Appuntamenti</Link>
                  </li>
                  <li className="nav-item">
                    <span className="navbar-text me-3">Ciao, {user.nome}</span>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-light" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-outline-light" to="/register">Registrati</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rotte Pubbliche */}
          <Route path="/medici" element={<DoctorsList />} />
          <Route path="/medici/:id" element={<DoctorDetail />} />

          {/* Rotte Protette */}
          <Route 
            path="/appuntamenti" 
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
