import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import { getToken } from './utils/auth';

function App() {
  const token = getToken();

  return (
    <Routes>
      <Route path="/" element={token ? <Chat /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
