// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login'; // Login komponenta
import Dashboard from './pages/Dashboard'; // Dashboard komponenta, opcionalno 
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} /> {/* Putanja za Login stranicu */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* Putanja za Dashboard */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
