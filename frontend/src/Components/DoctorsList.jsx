// frontend/src/components/DoctorsList.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMedici } from '../apiService';

function DoctorsList() {
  const [medici, setMedici] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedici = async () => {
      try {
        const data = await getMedici();
        setMedici(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedici();
  }, []);

  if (loading) {
    return <div className="container mt-5"><p>Caricamento medici...</p></div>;
  }

  if (error) {
    return <div className="container mt-5"><div className="alert alert-danger">{error}</div></div>;
  }

  return (
    <div className="container mt-5">
      <h2>Medici Disponibili</h2>
      <div className="list-group">
        {medici.length > 0 ? (
          medici.map(medico => (
            <div key={medico.id} className="col-md-6 col-lg-4 mb-4">
              <Link to={`/medici/${medico.id}`} className="card h-100 text-decoration-none">
                <div className="card-body">
                  <h5 className="card-title">{medico.nome_completo}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{medico.specializzazione}</h6>
                  <p className="card-text">{medico.descrizione}</p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>Nessun medico trovato.</p>
        )}
      </div>
    </div>
  );
}

export default DoctorsList;
