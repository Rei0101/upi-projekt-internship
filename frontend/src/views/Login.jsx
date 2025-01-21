import Input from "../components/Input";
import Button from "../components/Button";
import useLogin from "../viewModels/useLogin";
import { useState } from "react";

function Login() {
  const {
    email,
    setEmail,
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
          <label htmlFor="email">E-mail:</label>
          <Input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="unesite e-mail"
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
