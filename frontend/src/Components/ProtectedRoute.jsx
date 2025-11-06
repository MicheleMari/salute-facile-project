// frontend/src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // Se non c'è il token, reindirizza alla pagina di login
    return <Navigate to="/login" replace />;
  }

  // Se il token esiste, mostra il componente richiesto
  return children;
}

export default ProtectedRoute;
