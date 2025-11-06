// frontend/src/Components/BookingModal.jsx

import React, { useState, useMemo } from 'react';
import { prenotaAppuntamento } from '../apiService';
import { useNavigate } from 'react-router-dom';

function BookingModal({ medico, disponibilita, onClose }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isBooking, setIsBooking] = useState(false); // Stato per il caricamento
  const navigate = useNavigate();

  // Raggruppa gli slot per giorno per una visualizzazione più chiara
  const slotsByDay = useMemo(() => {
    return disponibilita.reduce((acc, slot) => {
      const date = new Date(slot.data_inizio).toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(slot);
      return acc;
    }, {});
  }, [disponibilita]);

  const handlePrenota = async () => {
    if (!selectedSlot) {
      setError("Per favore, seleziona uno slot orario.");
      return;
    }
    setError(null);
    setIsBooking(true); // Avvia il caricamento
    try {
      await prenotaAppuntamento({ disponibilita_id: selectedSlot });
      setSuccess("Appuntamento prenotato con successo! Sarai reindirizzato ai tuoi appuntamenti.");
      setTimeout(() => {
        onClose();
        navigate('/i-miei-appuntamenti'); // Corretto il path
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsBooking(false); // Termina il caricamento
    }
  };

  return (
    <div className="modal show fade" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title">Prenota con {medico.nome_completo}</h5>
              <h6 className="text-muted fw-normal">{medico.specializzazione}</h6>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            
            {!success && (
              disponibilita.length > 0 ? (
                Object.keys(slotsByDay).map(day => (
                  <div key={day} className="mb-4">
                    <h6 className="border-bottom pb-2 mb-3">{day}</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {slotsByDay[day].map(slot => (
                        <button
                          key={slot.id}
                          type="button"
                          className={`btn ${selectedSlot === slot.id ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setSelectedSlot(slot.id)}
                        >
                          {new Date(slot.data_inizio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">Nessuna disponibilità trovata per questo medico al momento.</p>
              )
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annulla</button>
            <button type="button" className="btn btn-primary" onClick={handlePrenota} disabled={success || isBooking || !selectedSlot}>
              {isBooking ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span className="ms-2">Prenotazione...</span>
                </>
              ) : (
                'Conferma Prenotazione'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;