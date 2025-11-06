// frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importa il Router
import App from './App.jsx';

// Importa Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Importa il CSS di default (lo lasciamo)
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Avvolge tutta l'app nel Router */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);