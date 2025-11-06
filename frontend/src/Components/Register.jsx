// frontend/src/components/Register.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importa useNavigate
import { registerUser } from '../apiService'; // 2. Importa la nostra funzione API

function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null); // Stato per messaggi d'errore
  const navigate = useNavigate(); // Inizializza il "navigatore"

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => { // 3. Trasformato in 'async'
    e.preventDefault();
    setError(null); // Resetta gli errori

    try {
      // 4. Chiama l'API
      const data = await registerUser(formData);
      
      console.log(data.messaggio); // "Utente registrato con successo!"
      alert('Registrazione completata! Ora puoi effettuare il login.');
      
      // 5. Reindirizza l'utente alla pagina di login
      navigate('/login');

    } catch (err) {
      // 6. Se l'API lancia un errore (es. "Email già registrata")
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
              <h2 className="card-title text-center">Registrati</h2>
              <form onSubmit={handleSubmit}>
                {/* 7. Mostra l'errore (se esiste) */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                {/* ... (tutti i campi input restano invariati) ... */}
                <div className="mb-3">
                  <label className="form-label">Nome</label>
                  <input
                    type="text"
                    name="nome"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cognome</label>
                  <input
                    type="text"
                    name="cognome"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
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
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success w-100">
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