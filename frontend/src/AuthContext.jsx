// frontend/src/AuthContext.jsx

import React, { createContext, useState, useContext } from 'react';

// 1. Creazione del Contesto di Autenticazione
// Questo contesto conterrà lo stato dell'utente e le funzioni di login/logout.
const AuthContext = createContext(null);

// 2. Creazione del Componente Provider
// Questo componente "fornirà" i dati del contesto a tutti i suoi figli.
export const AuthProvider = ({ children }) => {
  // 3. Definizione dello stato condiviso: l'utente.
  // All'avvio, controlla il localStorage per vedere se l'utente era già loggato.
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    return token && userData ? JSON.parse(userData) : null;
  });

  // 4. Funzione per effettuare il login.
  // Salva i dati dell'utente e il token nel localStorage e aggiorna lo stato.
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // 5. Funzione per effettuare il logout.
  // Rimuove i dati dal localStorage e resetta lo stato.
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // 6. Il Provider rende disponibili 'user', 'login' e 'logout' a tutta l'app.
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 7. Creazione di un Hook personalizzato (useAuth)
// Questo è un modo più semplice e pulito per accedere al contesto
// da qualsiasi componente, senza dover importare useContext e AuthContext ogni volta.
export const useAuth = () => {
  return useContext(AuthContext);
};