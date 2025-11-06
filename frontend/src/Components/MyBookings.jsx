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
      {appuntamenti.length > 0 ? (
        <ul className="list-group">
          {appuntamenti.map(app => (
            <li key={app.id} className="list-group-item">
              <p><strong>Medico:</strong> {app.medico.nome_completo} ({app.medico.specializzazione})</p>
              <p><strong>Data:</strong> {new Date(app.slot.data_inizio).toLocaleDateString()}</p>
              <p><strong>Ora:</strong> {new Date(app.slot.data_inizio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p><strong>Stato:</strong> <span className="badge bg-success">{app.stato}</span></p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Non hai nessun appuntamento prenotato.</p>
      )}
    </div>
  );
}

export default MyBookings;
