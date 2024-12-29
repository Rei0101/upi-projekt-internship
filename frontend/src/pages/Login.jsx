// pages/Login.jsx
import React, { useState } from 'react';

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
      const response = await fetch('https://tvoj-backend-api.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.success) {
        window.location.href = '/dashboard'; // Promijeni prema tvojoj stvarnoj ruti
      } else {
        setError('Neispravno korisničko ime ili lozinka!');
      }
    } catch (error) {
      setError('Došlo je do pogreške, pokušaj ponovno!');
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
