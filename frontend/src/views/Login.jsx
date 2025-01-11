import Input from "../components/Input";
import Button from "../components/Button";
import useLogin from "../viewModels/useLogin";
import { useState } from "react";

function Login() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    handleLogin,
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

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
            onChange={(e) => setUsername(e.target.value)}
            placeholder="unesite korisničko ime"
            required
           
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Lozinka:</label>
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="unesite lozinku"
            required
          
          />
          
          <Button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            text={showPassword ? "Sakrij" : "Prikaži"}
          />
        </div>
        
        
        {error && <p className="error-message">{error}</p>}
        <Button type="submit" text="Prijavi se" />
      </form>
    </div>
  );
}

export default Login;
