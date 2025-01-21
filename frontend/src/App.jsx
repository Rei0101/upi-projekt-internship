// App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './views/Login'; // Login komponenta
import Raspored from './views/Raspored'; // Raspored komponenta
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} /> {/* Putanja za Login stranicu */}
          <Route path="/raspored" element={<Raspored />} /> {/* Putanja za Dashboard */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
