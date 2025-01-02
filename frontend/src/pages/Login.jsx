// pages/Login.jsx
import Input from "../components/Input";
import useLogin from "../hooks/useLogin";

function Login() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    handleLogin,
  } = useLogin();

  return (
    <div className="login-container">
      <h2>Prijava</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="username">Korisničko ime:</label>
          <Input
            type="text"
            id="username"
            value={username}
            change={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Lozinka:</label>
          <Input
            type="password"
            id="password"
            value={password}
            change={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Prijavi se</button>
      </form>
    </div>
  );
}

export default Login;
