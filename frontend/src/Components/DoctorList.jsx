// frontend/src/Components/DoctorList.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getMedici } from '../apiService';

function DoctorList() {
  const [medici, setMedici] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State per i filtri
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('');

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

  // Estrae le specializzazioni uniche per il filtro
  const specializzazioni = useMemo(() => {
    if (!medici) return [];
    const specs = medici.map(m => m.specializzazione);
    return [...new Set(specs)].sort(); // Ordina alfabeticamente
  }, [medici]);

  // Filtra i medici in base ai criteri di ricerca
  const filteredMedici = useMemo(() => {
    return medici.filter(medico => {
      const nameMatch = medico.nome_completo.toLowerCase().includes(searchTerm.toLowerCase());
      const specMatch = selectedSpec ? medico.specializzazione === selectedSpec : true;
      return nameMatch && specMatch;
    });
  }, [medici, searchTerm, selectedSpec]);

  if (loading) return <div className="container mt-5"><p>Caricamento medici...</p></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container mt-5">
      <h2>Trova il tuo Specialista</h2>
      <p>Cerca un medico per nome o filtra per specializzazione.</p>

      {/* Sezione Filtri */}
      <div className="row mb-4 g-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Cerca per nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select className="form-select" value={selectedSpec} onChange={(e) => setSelectedSpec(e.target.value)}>
            <option value="">Tutte le specializzazioni</option>
            {specializzazioni.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        {filteredMedici.length > 0 ? filteredMedici.map(medico => (
          <div key={medico.id} className="col-md-6 col-lg-4 mb-4">
            <Link to={`/medici/${medico.id}`} className="text-decoration-none text-dark h-100">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary">{medico.nome_completo}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{medico.specializzazione}</h6>
                  <p className="card-text flex-grow-1">{medico.descrizione}</p>
                  <span className="btn btn-outline-primary mt-auto">Vedi dettagli e prenota</span>
                </div>
              </div>
            </Link>
          </div>
        )) : (
          <p className="text-center text-muted">Nessun medico trovato con i criteri di ricerca selezionati.</p>
        )}
      </div>
    </div>
  );
}

export default DoctorList;