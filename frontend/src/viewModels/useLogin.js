import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setUserEmail,
  setTermini,
  setSviTermini,
  setNotes,
  setKolokviji,
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
        const sviTerminiResponse = await axios.post(
          "http://localhost:3000/api/korisnik/sve-grupe",
          { email },
          {
            headers: {
              Authorization: `Bearer ${data.token}`
            }
          }
        );
        const sviTermini = sviTerminiResponse.data;
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

        console.log(notes);
        
        localStorage.setItem("notes", notes.note[0].todo_zapis);

        // Sprema  u Redux store
        dispatch(setTermini(termini));
        dispatch(setSviTermini(sviTermini));
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
