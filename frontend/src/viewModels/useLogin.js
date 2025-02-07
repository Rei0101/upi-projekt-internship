import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setUserEmail,
  setTermini,
  setSviTermini,
  setNotes,
  setKolokviji,
  setZahtjevi,
} from "../redux/userSlice";
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
      setError("Oba polja su obavezna!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/korisnik/login",
        {
          email,
          password,
        }
      );

      const data = response.data;

      localStorage.setItem("email", email);
      localStorage.setItem("token", data.token);
      
      if (data.success) {
        // Uspješna prijava
        dispatch(setUserEmail(email));
        const terminiResponse = await axios.post(
          "http://localhost:3000/api/korisnik/raspored",
          { email },
          {
            headers: {
              Authorization: `Bearer ${data.token}`
            }
          }
        );
        const termini = terminiResponse.data;
        localStorage.setItem("tip", termini.userType);
        localStorage.setItem("termini", JSON.stringify(termini.termini));

        const sviterminiResponse = await axios.post(
          "http://localhost:3000/api/korisnik/sve-grupe",
          { email },
          {
            headers: {
              Authorization: `Bearer ${data.token}`
            }
          }
        );
        const svitermini = sviterminiResponse.data;
        localStorage.setItem("svitermini", JSON.stringify(svitermini.grupe));

        const notesResponse = await axios.post(
          "http://localhost:3000/api/korisnik/todo",
          { email },
          {
            headers: {
              Authorization: `Bearer ${data.token}`
            }
          }
        );
        const notes = notesResponse.data;
        localStorage.setItem("notes", notes.note[0].todo_zapis);
        

        const kolokvijiResponse = await axios.post(
          "http://localhost:3000/api/korisnik/kolokviji",
          { email },
          {
            headers: {
              Authorization: `Bearer ${data.token}`
            }
          }
        );
        const kolokviji = kolokvijiResponse.data;
        localStorage.setItem("kolokviji", JSON.stringify(kolokviji.colloquiums));
        
        if (localStorage.getItem("tip") === "student") {
          const zahtjeviResponse = await axios.post(
            "http://localhost:3000/api/korisnik/dobavi-zahtjev",
            { student_email: email },
            {
              headers: {
                Authorization: `Bearer ${data.token}`
              }
            }
          );
          const zahtjevi = zahtjeviResponse.data;
          dispatch(setZahtjevi(zahtjevi));
          localStorage.setItem("zahtjev", JSON.stringify(zahtjevi?.data !== undefined ? zahtjevi : {message: "Nema zahtjeva za razmjenu."}));
          
        }
        // Sprema  u Redux store
        dispatch(setTermini(termini));
        dispatch(setSviTermini(svitermini));
        dispatch(setNotes(notes));
        dispatch(setKolokviji(kolokviji));
        navigate("/raspored");
      } else {
        setError(data.message || "Došlo je do pogreške prilikom prijave!");
      }
    } catch (error) {
      setError("Neispravno korisničko ime ili lozinka!");
      console.error(error);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleLogin,
  };
}
