import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Oba polja su obavezna!');
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/korisnik/login", {
        email,
        password,
      });
  
      const data = response.data;
      
      if (data.success) {
        // Uspješna prijava
        window.location.href = "/raspored";
        console.log("uspjeh")
      } else {
        
        setError(data.message || "Došlo je do pogreške prilikom prijave!"); 
      }
    } catch (error) {
      setError("Neispravno korisničko ime ili lozinka!");
      console.error(error);
      
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleLogin
  }
}