// frontend/src/components/MyBookings.jsx

import React, { useState, useEffect } from 'react';
import { getMyAppuntamenti, cancellaAppuntamento } from '../apiService';

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

  const handleCancella = async (appuntamentoId) => {
    // Chiede conferma all'utente
    if (!window.confirm("Sei sicuro di voler cancellare questo appuntamento?")) {
      return;
    }

    try {
      await cancellaAppuntamento(appuntamentoId);
      // Rimuove l'appuntamento cancellato dallo stato per aggiornare l'UI
      setAppuntamenti(appuntamenti.filter(app => app.id !== appuntamentoId));
    } catch (err) {
      setError(err.message); // Mostra un errore in caso di problemi
    }
  };

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
              <div className="card h-100 d-flex flex-column">
                <div className="card-body flex-grow-1">
                  <h5 className="card-title">{app.medico.specializzazione}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{app.medico.nome_completo}</h6>
                  <p className="card-text">
                    <strong>Data:</strong> {new Date(app.slot.data_inizio).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}<br/>
                    <strong>Ora:</strong> {new Date(app.slot.data_inizio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <span className="badge bg-success">{app.stato}</span>
                </div>
                <div className="card-footer bg-white border-0 pt-0">
                  <button onClick={() => handleCancella(app.id)} className="btn btn-outline-danger btn-sm w-100">
                    Cancella Appuntamento
                  </button>
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
