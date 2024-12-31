// pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Oba polja su obavezna!');
      return;
    }

    try {

      const response = await axios.post('https://tvoj-backend-api.com/login', {
        username,
        password
      });

      const data = response.data;

      if (data.success) {
        window.location.href = '/raspored';
      } else {
        setError('Neispravno korisničko ime ili lozinka!');
      }
    } catch (error) {
      setError('Došlo je do pogreške, pokušaj ponovno!');
      console.log(error);
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
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Lozinka:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Prijavi se</button>
      </form>
    </div>
  );
}

export default Login;
