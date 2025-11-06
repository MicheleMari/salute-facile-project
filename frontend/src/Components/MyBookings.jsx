// frontend/src/components/MyBookings.jsx

import React, { useState, useEffect } from 'react';
import { getMyAppuntamenti } from '../apiService';

function MyBookings() {
  const [appuntamenti, setAppuntamenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppuntamenti = async () => {
      try {
        const data = await getMyAppuntamenti();
        setAppuntamenti(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppuntamenti();
  }, []);

  if (loading) {
    return <div className="container mt-5"><p>Caricamento appuntamenti...</p></div>;
  }

  if (error) {
    return <div className="container mt-5"><div className="alert alert-danger">{error}</div></div>;
  }

  return (
    <div className="container mt-5">
      <h2>I Miei Appuntamenti</h2>
      <p>Qui trovi l'elenco delle tue prossime visite.</p>
      {appuntamenti.length > 0 ? (
        <div className="row">
          {appuntamenti.map(app => (
            <div key={app.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{app.medico.specializzazione}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{app.medico.nome_completo}</h6>
                  <p className="card-text">
                    <strong>Data:</strong> {new Date(app.slot.data_inizio).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}<br/>
                    <strong>Ora:</strong> {new Date(app.slot.data_inizio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <span className="badge bg-success">{app.stato}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Non hai nessun appuntamento prenotato.</p>
      )}
    </div>
  );
}

export default MyBookings;
