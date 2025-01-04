// pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const[showpassword,setshowpassword]=useState(false)

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Oba polja su obavezna!');
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });
  
      const data = response.data;
  
      if (data.success) {
        // Uspješna prijava
        window.location.href = "/raspored";
      } else {
        setError(data.message || "Neispravno korisničko ime ili lozinka!"); //Preskoči ovaj dio iako je neispravna lozinka i ime
      }
    } catch (error) {
      setError("Došlo je do pogreške, pokušaj ponovno!");
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <h2>Prijava</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="username">Korisničko ime:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder='unesite korisničko ime'
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Lozinka:</label>
          <input
            type={showpassword?"text":"password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='unesite lozinku'
          />
          <button
              type="button"
              className="toggle-password"
              onClick={() => setshowpassword(!showpassword)}
            >
              {showpassword ? "Sakrij" : "Prikaži"}
          </button>
          
        </div>
        
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Prijavi se</button>
      </form>
    </div>
  );
}

export default Login;
