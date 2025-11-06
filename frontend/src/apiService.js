// frontend/src/apiService.js

const API_URL = 'http://localhost:5000/api';

/**
 * Funzione helper per gestire le risposte dell'API
 * @param {Response} response - La risposta da fetch
 */
const handleResponse = async (response) => {
  // res.json() legge il corpo della risposta (es. { "errore": "..." })
  const data = await response.json();
  
  // Se la risposta non è "ok" (es. 400, 401, 409, 500)
  if (!response.ok) {
    // Lancia un errore che useremo nel .catch()
    // Prende il messaggio d'errore dal backend, o usa un messaggio di default
    throw new Error(data.errore || 'Si è verificato un errore');
  }
  
  // Se è "ok", restituisce i dati (es. { "messaggio": "...", "access_token": "..." })
  return data;
};

/**
 * Chiama l'endpoint /api/register
 * @param {object} userData - { nome, cognome, email, password }
 */
export const registerUser = (userData) => {
  return fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  }).then(handleResponse); // Passa la risposta al nostro helper
};

/**
 * Chiama l'endpoint /api/login
 * @param {object} credentials - { email, password }
 */
export const loginUser = (credentials) => {
  return fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  }).then(handleResponse);
};

// --- Funzioni Aggiuntive ---

/**
 * Helper per ottenere l'header di autorizzazione con il token JWT
 */
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

/**
 * Chiama l'endpoint /api/medici
 */
export const getMedici = () => {
  return fetch(`${API_URL}/medici`, {
    method: 'GET'
  }).then(handleResponse);
};

/**
 * Chiama l'endpoint /api/medici/<id>/disponibilita
 * @param {number} medicoId - L'ID del medico
 */
export const getDisponibilita = (medicoId) => {
  return fetch(`${API_URL}/medici/${medicoId}/disponibilita`, {
    method: 'GET'
  }).then(handleResponse);
};

/**
 * Chiama l'endpoint /api/appuntamenti per il GET
 */
export const getMyAppuntamenti = () => {
  return fetch(`${API_URL}/appuntamenti`, {
    method: 'GET',
    headers: getAuthHeader()
  }).then(handleResponse);
};


/**
 * Chiama l'endpoint /api/appuntamenti per il POST
 * @param {object} data - { disponibilita_id: ... }
 */
export const prenotaAppuntamento = (data) => {
  return fetch(`${API_URL}/appuntamenti`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  }).then(handleResponse);
};