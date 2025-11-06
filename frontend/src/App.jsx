// frontend/src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Components/Home';
import Register from './Components/Register';
import Login from './Components/Login';
import DoctorList from './Components/DoctorList';
import MyBookings from './Components/MyBookings';
import DoctorDetail from './Components/DoctorDetail';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          {/* Rotte Pubbliche */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotte Protette */}
          <Route
            path="/medici"
            element={
              <ProtectedRoute>
                <DoctorList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medici/:id"
            element={
              <ProtectedRoute>
                <DoctorDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appuntamenti"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;