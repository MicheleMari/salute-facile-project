// frontend/src/components/DoctorDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDisponibilita, prenotaAppuntamento } from '../apiService';

function DoctorDetail() {
  const { id } = useParams(); // Legge l'ID del medico dall'URL
  const navigate = useNavigate();
  const [disponibilita, setDisponibilita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  useEffect(() => {
    const fetchDisponibilita = async () => {
      try {
        const data = await getDisponibilita(id);
        setDisponibilita(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDisponibilita();
  }, [id]);

  const handlePrenota = async (slotId) => {
    setBookingError(null);
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Devi effettuare il login per prenotare!');
      navigate('/login');
      return;
    }

    if (!window.confirm("Sei sicuro di voler prenotare questo slot?")) {
      return;
    }

    try {
      await prenotaAppuntamento({ disponibilita_id: slotId });
      alert('Appuntamento prenotato con successo!');
      // Ricarica le disponibilità per rimuovere lo slot prenotato
      const data = await getDisponibilita(id);
      setDisponibilita(data);
    } catch (err) {
      setBookingError(err.message);
    }
  };

  if (loading) {
    return <div className="container mt-5"><p>Caricamento disponibilità...</p></div>;
  }

  if (error) {
    return <div className="container mt-5"><div className="alert alert-danger">{error}</div></div>;
  }

  return (
    <div className="container mt-5">
      <h3>Slot Orari Disponibili</h3>
      {bookingError && <div className="alert alert-danger">{bookingError}</div>}
      <div className="list-group">
        {disponibilita.length > 0 ? (
          disponibilita.map(slot => (
            <div className="card mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="card-text mb-1">
                  Data: {new Date(slot.data_inizio).toLocaleDateString()}
                </p>
                <p className="card-text mb-0">
                  Ora: {new Date(slot.data_inizio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.data_fine).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={() => handlePrenota(slot.id)}
              >
                Prenota
              </button>
            </div>
          </div>
        </div>
          ))
        ) : (
          <p>Nessuna disponibilità per questo medico.</p>
        )}
      </div>
    </div>
  );
}

export default DoctorDetail;
