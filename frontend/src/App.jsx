import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'; 
import Login from './pages/Login';
/* import Header from './components/Header';
import Footer from './components/Footer'; */
//? u slučaju da želite header i footer komponente

function App() {
  return (
    <Router>
      {/* <Header />  */}
      
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
      
      {/* <Footer /> */}
    </Router>
  );
}

export default App;

