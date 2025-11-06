// frontend/src/components/Register.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook per la navigazione programmatica
import { registerUser } from '../apiService'; // Funzione per chiamare l'API di registrazione

function Register() {
  // Stato per memorizzare i dati inseriti nel form
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null); // Stato per gestire eventuali messaggi di errore
  const navigate = useNavigate(); // Inizializza l'hook per la navigazione

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestisce l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Resetta gli errori precedenti

    try {
      // Chiama la funzione API per registrare l'utente
      const data = await registerUser(formData);
      alert('Registrazione completata! Ora puoi effettuare il login.');
      // Se la registrazione ha successo, reindirizza l'utente alla pagina di login
      navigate('/login');

    } catch (err) {
      // Se l'API restituisce un errore, lo mostra all'utente
      console.error(err.message);
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Registrati</h2>
              <form onSubmit={handleSubmit}>
                {/* Mostra un messaggio di errore se presente */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nome</label>
                    <input
                      type="text"
                      name="nome"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Cognome</label>
                    <input
                      type="text"
                      name="cognome"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="nome@esempio.com"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Minimo 8 caratteri"
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Registrati
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;