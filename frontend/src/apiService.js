// Definisce l'URL di base per tutte le chiamate API.
const API_URL = "http://localhost:5000/api";

/**
 * Gestore universale per le risposte delle chiamate `fetch`.
 * Controlla se la risposta è andata a buon fine e gestisce gli errori.
 * @param {Response} response L'oggetto Response restituito da fetch.
 * @returns {Promise<any>} I dati JSON della risposta.
 * @throws {Error} Lancia un errore se la risposta non è 'ok' (es. status 4xx o 5xx).
 */
const handleResponse = async (response) => {
  // Estrae il corpo della risposta in formato JSON.
  const data = await response.json();

  // Se la risposta HTTP non ha avuto successo (es. status 401, 404, 500),
  // lancia un errore utilizzando il messaggio fornito dal backend.
  if (!response.ok) {
    throw new Error(data.errore || "Si è verificato un errore sconosciuto");
  }

  // Altrimenti, restituisce i dati.
  return data;
};

/**
 * Effettua la registrazione di un nuovo utente.
 * @param {object} userData Dati dell'utente da registrare (nome, cognome, email, password).
 * @returns {Promise<object>} La risposta del server.
 */
export const registerUser = (userData) => {
  return fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  }).then(handleResponse);
};

/**
 * Effettua il login di un utente.
 * @param {object} credentials Credenziali dell'utente (email, password).
 * @returns {Promise<object>} La risposta del server, che include il token di accesso.
 */
export const loginUser = (credentials) => {
  return fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then(handleResponse);
};

/**
 * Funzione helper per creare l'header di autorizzazione con il token JWT.
 * @returns {object} Un oggetto contenente gli header per le richieste autenticate.
 */
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

/**
 * Recupera la lista di tutti i medici.
 * @returns {Promise<Array<object>>} Un array di oggetti, ciascuno rappresentante un medico.
 */
export const getMedici = () => {
  return fetch(`${API_URL}/medici`, {
    method: "GET"
  }).then(handleResponse);
};

/**
 * Recupera gli slot di disponibilità per un medico specifico.
 * @param {number} medicoId L'ID del medico.
 * @returns {Promise<Array<object>>} Un array di slot di disponibilità.
 */
export const getDisponibilita = (medicoId) => {
  return fetch(`${API_URL}/medici/${medicoId}/disponibilita`, {
    method: "GET"
  }).then(handleResponse);
};

/**
 * Recupera la lista degli appuntamenti per l'utente loggato.
 * @returns {Promise<Array<object>>} Un array di appuntamenti.
 */
export const getMyAppuntamenti = () => {
  return fetch(`${API_URL}/appuntamenti`, {
    method: "GET",
    headers: getAuthHeader()
  }).then(handleResponse);
};

/**
 * Invia una richiesta per prenotare un nuovo appuntamento.
 * @param {object} data Contiene l'ID dello slot di disponibilità da prenotare.
 * @returns {Promise<object>} La conferma della prenotazione.
 */
export const prenotaAppuntamento = (data) => {
  return fetch(`${API_URL}/appuntamenti`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  }).then(handleResponse);
};