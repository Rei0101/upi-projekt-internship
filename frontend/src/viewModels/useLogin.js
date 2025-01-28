import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserEmail, setTermini, setSviTermini, setNotes ,setKolokviji,setZahtjevi} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
        const sviterminiResponse = await axios.post("http://localhost:3000/api/korisnik/sve-grupe", { email });
        const svitermini = sviterminiResponse.data
        const notesResponse = await axios.post("http://localhost:3000/api/korisnik/todo", { email });
        const notes = notesResponse.data;
        const kolokvijiResponse=await axios.post("http://localhost:3000/api/korisnik/kolokviji",{email})
        const kolokviji=kolokvijiResponse.data;
        const zahtjeviResponse=await axios.post("http://localhost:3000/api/korisnik/dobavi-zahtjev",{student_email:email})
        const zahtjevi=zahtjeviResponse.data
        // Sprema  u Redux store
        dispatch(setTermini(termini));
        dispatch(setSviTermini(svitermini));
        dispatch(setNotes(notes))
        dispatch(setKolokviji(kolokviji))
        dispatch(setZahtjevi(zahtjevi))
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