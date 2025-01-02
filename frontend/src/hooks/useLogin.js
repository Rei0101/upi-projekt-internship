import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
  }

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    handleLogin
  }
}