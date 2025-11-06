// frontend/src/components/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../apiService'; // Importa la funzione API
import { useAuth } from '../AuthContext';   // Importa l'hook per l'autenticazione

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // Ottieni la funzione login dal Context

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      // Chiama l'API con le credenziali
      const data = await loginUser({ email, password });

      // Usa la funzione del Context per salvare i dati e il token
      login(data.utente, data.access_token);

      alert('Login effettuato con successo!');
      navigate('/'); // Reindirizza alla Home Page
      
    } catch (err) {
      // Se l'API lancia un errore (es. "Credenziali non valide")
      console.error(err.message);
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Login</h2>
              
              {/* Qui mostriamo l'errore, se c'è */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {/* Questo è il FORM */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="passwordInput" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Accedi
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;