import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserEmail, setTermini,setSviTermini,setNotes} from "../redux/userSlice"; 
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch=useDispatch();
  const navigate=useNavigate();
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
        dispatch(setUserEmail(email))
        const terminiResponse = await axios.post("http://localhost:3000/api/korisnik/raspored", { email });
        const termini = terminiResponse.data;
        const sviterminiResponse=await axios.post("http://localhost:3000/api/korisnik/sve-grupe",{email});
        console.log(sviterminiResponse)
        const svitermini=sviterminiResponse.data

        // Sprema termine u Redux store
        dispatch(setTermini(termini));
        dispatch(setSviTermini(svitermini));
        navigate("/raspored");
        
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