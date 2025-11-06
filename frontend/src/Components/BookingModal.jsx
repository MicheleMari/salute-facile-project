// frontend/src/Components/BookingModal.jsx

import React, { useState } from 'react';
import { prenotaAppuntamento } from '../apiService';
import { useNavigate } from 'react-router-dom';

function BookingModal({ medico, disponibilita, onClose }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handlePrenota = async () => {
    if (!selectedSlot) {
      setError("Per favore, seleziona uno slot orario.");
      return;
    }
    setError(null);
    try {
      await prenotaAppuntamento({ disponibilita_id: selectedSlot });
      setSuccess("Appuntamento prenotato con successo! Sarai reindirizzato ai tuoi appuntamenti.");
      setTimeout(() => {
        onClose();
        navigate('/appuntamenti');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal show fade" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Prenota con {medico.nome_completo}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <p>Seleziona uno slot disponibile:</p>
            <div className="list-group">
              {disponibilita.length > 0 ? disponibilita.map(slot => (
                <button
                  key={slot.id}
                  type="button"
                  className={`list-group-item list-group-item-action ${selectedSlot === slot.id ? 'active' : ''}`}
                  onClick={() => setSelectedSlot(slot.id)}
                >
                  {new Date(slot.data_inizio).toLocaleDateString()} - {new Date(slot.data_inizio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </button>
              )) : <p>Nessuna disponibilità trovata per questo medico.</p>}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annulla</button>
            <button type="button" className="btn btn-primary" onClick={handlePrenota} disabled={success}>Conferma Prenotazione</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;