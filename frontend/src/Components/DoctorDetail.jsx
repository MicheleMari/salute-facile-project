// frontend/src/Components/DoctorDetail.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Importa le icone di Bootstrap
import { getMedicoDetail, getDisponibilita, prenotaAppuntamento } from '../apiService';

function DoctorDetail() {
  const { id } = useParams(); // Legge l'ID del medico dall'URL
  const navigate = useNavigate();

  const [medico, setMedico] = useState(null);
  const [disponibilita, setDisponibilita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State per la prenotazione
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState({ error: null, success: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carica in parallelo i dettagli del medico e le sue disponibilità
        const [medicoData, disponibilitaData] = await Promise.all([
          getMedicoDetail(id),
          getDisponibilita(id)
        ]);
        setMedico(medicoData);
        setDisponibilita(disponibilitaData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Raggruppa gli slot per giorno
  const slotsByDay = useMemo(() => {
    return disponibilita.reduce((acc, slot) => {
      const date = new Date(slot.data_inizio).toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      if (!acc[date]) acc[date] = [];
      acc[date].push(slot);
      return acc;
    }, {});
  }, [disponibilita]);

  const handlePrenota = async () => {
    if (!selectedSlot) {
      setBookingStatus({ error: "Per favore, seleziona uno slot orario.", success: null });
      return;
    }
    setBookingStatus({ error: null, success: null });
    setIsBooking(true);
    try {
      await prenotaAppuntamento({ disponibilita_id: selectedSlot });
      setBookingStatus({ error: null, success: "Appuntamento prenotato con successo! Sarai reindirizzato..." });
      setTimeout(() => navigate('/i-miei-appuntamenti'), 2000);
    } catch (err) {
      setBookingStatus({ error: err.message, success: null });
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <div className="container mt-5"><p>Caricamento medico...</p></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">{error}</div></div>;
  if (!medico) return null;

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Colonna Dettagli Medico */}
        <div className="col-lg-4 mb-4">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <img 
              src={medico.foto_url || 'https://placehold.co/600x400/007bff/white?text=Foto'} 
              className="card-img-top" 
              alt={`Foto di ${medico.nome_completo}`} 
              style={{ objectFit: 'cover', height: '250px' }}
            />
            <div className="card-body text-center">
              <h2 className="card-title">{medico.nome_completo}</h2>
              <h5 className="card-subtitle mb-3 text-muted">{medico.specializzazione}</h5>
            </div>
            <div className="card-body border-top">
              <p className="card-text text-start">{medico.descrizione}</p>
            </div>
            <div className="card-footer text-center">
              {(medico.linkedin_url || medico.sito_web_url) && (
                <div className="d-flex justify-content-center gap-3">
                  {medico.linkedin_url && (
                    <a href={medico.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-secondary fs-4">
                      <i className="bi bi-linkedin"></i>
                    </a>
                  )}
                  {medico.sito_web_url && (
                    <a href={medico.sito_web_url} target="_blank" rel="noopener noreferrer" className="text-secondary fs-4">
                      <i className="bi bi-globe"></i>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colonna Disponibilità e Prenotazione */}
        <div className="col-lg-8">
          <h3>Prenota una visita</h3>
          {bookingStatus.error && <div className="alert alert-danger">{bookingStatus.error}</div>}
          {bookingStatus.success && <div className="alert alert-success">{bookingStatus.success}</div>}

          {!bookingStatus.success && (
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
              <p className="text-muted">Nessuna disponibilità trovata per questo medico al momento.</p>
            )
          )}

          {disponibilita.length > 0 && !bookingStatus.success && (
            <button className="btn btn-primary btn-lg mt-3" onClick={handlePrenota} disabled={isBooking || !selectedSlot}>
              {isBooking ? 'Prenotazione in corso...' : 'Conferma Prenotazione'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorDetail;
