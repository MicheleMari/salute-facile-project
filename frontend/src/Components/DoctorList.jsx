// frontend/src/Components/DoctorList.jsx

import React, { useState, useEffect } from 'react';
import { getMedici, getDisponibilita } from '../apiService';
import BookingModal from './BookingModal';

function DoctorList() {
  const [medici, setMedici] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State per la modale
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [disponibilita, setDisponibilita] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleOpenModal = async (medico) => {
    setSelectedMedico(medico);
    try {
      const slots = await getDisponibilita(medico.id);
      setDisponibilita(slots);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="container mt-5"><p>Caricamento medici...</p></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container mt-5">
      <h2>Trova il tuo Specialista</h2>
      <div className="row">
        {medici.map(medico => (
          <div key={medico.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{medico.nome_completo}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{medico.specializzazione}</h6>
                <p className="card-text flex-grow-1">{medico.descrizione}</p>
                <button onClick={() => handleOpenModal(medico)} className="btn btn-primary mt-auto">
                  Prenota una visita
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedMedico && (
        <BookingModal medico={selectedMedico} disponibilita={disponibilita} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export default DoctorList;