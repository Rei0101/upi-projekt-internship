import { useState } from "react";
import "../css/raspored.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

function Raspored() {
  const days = [
    "Ponedjeljak",
    "Utorak",
    "Srijeda",
    "Četvrtak",
    "Petak",
    "Subota",
    "Nedjelja",
  ];

  const termini = useSelector((state) => state.user.termini.termini);
  const svitermini = useSelector((state) => state.user.svitermini.grupe);
  const notes = useSelector((state) => state.user.notes.note[0].todo_zapis);
  const email = useSelector((state) => state.user.email);
  const kolokviji = useSelector((state) => state.user.kolokviji.colloquiums);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTermin, setSelectedTermin] = useState(null);
  const [text, setText] = useState(notes || "");
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch();
  const [participants, setParticipants] = useState([]);
  const [showParticipantsPopup, setShowParticipantsPopup] = useState(false);
  const [zahtjev, setZahtjev] = useState(useSelector((state) => state.user.zahtjevi));
  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleGridEventClick = (termin) => {
    if (showAll && termin) {
      setSelectedTermin(termin);
      console.log(podatak)
    }
  };

  const handleClosePopup = () => {
    setSelectedEvent(null);
    setSelectedTermin(null);;
    setShowParticipantsPopup(false)
  };

  const handleSave = async () => {
    if (!text.trim()) {
      alert("Bilješka ne može biti prazna!");
      return;
    }
    try {
      await axios.put("http://localhost:3000/api/korisnik/novi-todo", {
        email: email,
        noviZapis: text,
      });
    } catch (error) {
      console.error("Greška prilikom slanja zahtjeva:", error);
    }
  };

  const mapTerminiToGrid = (terminiData) => {
    if (!Array.isArray(terminiData) || terminiData.length === 0) {
      return [];
    }

    const grid = [];
    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
      grid[dayIndex] = Array(5).fill(null);
      for (const termin of terminiData) {
        if (termin.dan_u_tjednu.trim() === days[dayIndex].trim()) {
          const startHour = parseInt(termin.pocetak.split(":")[0], 10);
          const eventIndex = startHour - 8;

          if (eventIndex >= 0 && eventIndex < grid[dayIndex].length) {
            grid[dayIndex][eventIndex] = {
              kolegij_naziv: termin.kolegij_naziv,
              grupa_naziv: termin.grupa_naziv,
              pocetak: termin.pocetak,
              kraj: termin.kraj,
              prostorija_naziv: termin.rsprostorija_naziv,
              type: termin.kolegij_naziv.includes("Predavanja")
                ? "predavanje"
                : "vjezbe",
            };
          }
        }
      }
    }
    return grid;
  };

  const gridData = mapTerminiToGrid(showAll ? svitermini : termini);

  const handleChangeGroup = async () => {
    if (!selectedTermin) {
      console.error("Nijedan termin nije odabran.");
      return;
    }

    const { kolegij_id, grupa_naziv } = selectedTermin;
    const staritermin = termini.find((stari) => stari.kolegij_id == kolegij_id);
    const stara_grupa_id = staritermin.grupa_naziv;
    const nova_grupa_id = grupa_naziv;

    const student_email = email;
    console.log(student_email, kolegij_id, stara_grupa_id, nova_grupa_id);
    try {
      const promjena = await axios.patch("http://localhost:3000/api/korisnik/promjena-grupe", {
        student_email,
        kolegij_id,
        stara_grupa_id,
        nova_grupa_id,
      });
      console.log("Promjena grupe uspješna:", promjena.data);
    } catch (error) {
      console.error("Greška prilikom promjene grupe:", error);
    }
  };

  const handleShowParticipants = async () => {
    try {
      const kolegij_naziv = selectedTermin.kolegij_naziv
      const response = await axios.post(
        "http://localhost:3000/api/korisnik/dobavi-sudionike", { kolegij_naziv }
      );
      const podaci = response.data.data
      console.log(podaci)
      const polaznici = podaci.find((grupa) => grupa.grupa_naziv === selectedTermin.grupa_naziv).sudionici
      console.log(polaznici)
      setParticipants(polaznici);
      setShowParticipantsPopup(true)

    } catch (error) {
      console.error("Greška pri dohvaćanju polaznika:", error);
    }
  };
  const handleRequestExchange = async (recipientEmail) => {
    try {
      const staritermin = termini.find((grupa) => grupa.kolegij_id === selectedTermin.kolegij_id).grupa_naziv
      console.log(email, recipientEmail, selectedTermin.kolegij_id, staritermin, selectedTermin.grupa_naziv)
      const response = await axios.post(
        "http://localhost:3000/api/korisnik/zahtjev-razmjene",
        {
          posiljatelj_email: email,
          primatelj_email: recipientEmail,
          kolegij_id: selectedTermin.kolegij_id,
          stara_grupa_id: staritermin,
          nova_grupa_id: selectedTermin.grupa_naziv,
        }
      );

      console.log("Zahtjev za zamjenu uspješan:", response.data);
    } catch (error) {
      console.error("Greška pri slanju zahtjeva za zamjenu:", error);
    }
  };
  const handleResponse = async (value) => {
    try {

      const response = await axios.post(
        "http://localhost:3000/api/korisnik/obradi-zahtjev",
        {
          primatelj_email: email,
          odluka: value
        }
      );
      console.log("Zahtjev za odgovor uspješan:", response.data);
    } catch (error) {
      console.error("Greška pri slanju odgovora na zahtjev:", error);
    }
  }
  return (
    <>
      <div className="events">
        <h4>Kolokviji</h4>
        <ul className="event-list">
          {kolokviji.map((event, index) => (
            <li
              key={index}
              className="event-item"
              onClick={() => handleEventClick(event)}
            >
              <span className="event-title">{event.naziv_kolegija}</span>
              <span className="event-date">
                {new Date(event.datum).toLocaleDateString("hr-HR")}
              </span>
            </li>
          ))}
        </ul>
        {zahtjev.message!=="Nema zahtjeva za razmjenu." && (
          <div>
            <h3>Zahtjevi</h3>
            {zahtjev.data[0].posiljatelj_ime} iz kolegija {zahtjev.data[0].kolegij} želi promijeniti {zahtjev.data[0].stara_grupa} za vašu {zahtjev.data[0].nova_grupa}
            <button value="Accepted" onClick={(e) => handleResponse(e.target.value)}>Prihvati</button>
            <button value="Rejected" onClick={(e) => handleResponse(e.target.value)}>Odbij</button>
          </div>
        )}
        {selectedEvent && (
          <div className="popup-overlay" onClick={handleClosePopup}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
              <h3>{selectedEvent.naziv_kolegija}</h3>
              <p>
                <strong>Grupa:</strong> {selectedEvent.naziv_grupe}
              </p>
              <p>
                <strong>Datum:</strong>{" "}
                {new Date(selectedEvent.datum).toLocaleDateString("hr-HR")}
              </p>
              <p>
                <strong>Dan u tjednu:</strong> {selectedEvent.dan_u_tjednu}
              </p>
              <p>
                <strong>Vrijeme:</strong> {selectedEvent.pocetak} -{" "}
                {selectedEvent.kraj}
              </p>
              <p>
                <strong>Profesor:</strong> {selectedEvent.profesor_ime}
              </p>
              <p>
                <strong>Prostorija:</strong> {selectedEvent.naziv_prostorije}
              </p>
              <button onClick={handleClosePopup}>Zatvori</button>
            </div>
          </div>
        )}

        {selectedTermin && (
          <div className="popup-overlay" onClick={handleClosePopup}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
              <h3>{selectedTermin.kolegij_naziv}</h3>
              <p>
                <strong>Popunjenost:</strong>{" "}
                {selectedTermin.popunjenost_kapacitet}/
                {selectedTermin.prostorija_kapacitet}
              </p>
              {selectedTermin.popunjenost_kapacitet !==
                selectedTermin.prostorija_kapacitet &&
                selectedTermin.kolegij_naziv.includes("Vježbe") && (
                  <button onClick={handleChangeGroup}>Promijeni grupu</button>
                )}
              {selectedTermin.popunjenost_kapacitet ===
                selectedTermin.prostorija_kapacitet && (
                  <button onClick={handleShowParticipants}>Prikaži sudionike</button>
                )}
              <button onClick={handleClosePopup}>Zatvori</button>
            </div>
          </div>
        )}
        {showParticipantsPopup && (
          <div className="popup-overlay" onClick={handleClosePopup}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
              <h3>Sudionici</h3>
              <ul>
                {participants.map((participant, index) => (
                  <li key={index}>
                    {participant}{" "}
                    <button
                      onClick={() => handleRequestExchange(participant)}
                    >
                      Zatraži zamjenu
                    </button>
                  </li>
                ))}
              </ul>
              <button onClick={handleClosePopup}>Zatvori</button>
            </div>
          </div>
        )}
      </div>

      <div className="main-container">
        <div className="schedule-container">
          <div className="schedule-grid">
            {days.map((day) => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}
            {gridData.map((day, dayIndex) => (
              <div key={dayIndex} className="day-column">
                {day.map((event, eventIndex) =>
                  event !== null ? (
                    <div
                      key={`${dayIndex}-${eventIndex}`}
                      className={`grid-cell ${event.type === "predavanje" ? "yellow" : "red"
                        }`}
                      onClick={() =>
                        handleGridEventClick(
                          svitermini.find(
                            (t) =>
                              t.kolegij_naziv === event.kolegij_naziv &&
                              t.dan_u_tjednu === days[dayIndex]
                          )
                        )
                      }
                    >
                      {event.kolegij_naziv} -
                      {event.grupa_naziv}-
                      {event.pocetak}-{event.kraj}
                      -{event.prostorija_naziv}
                    </div>
                  ) : (
                    <div
                      key={`${dayIndex}-${eventIndex}`}
                      className="grid-cell"
                    ></div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="side-container">
          <div className="text-area">
            <h2>Zabilješke</h2>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Unesite tekst ovdje..."
              rows="10"
            />
            <button onClick={handleSave}>Spremi</button>
          </div>
        </div>
      </div>

      <div className="checkbox-container">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
            className="checkbox-input"
          />
          Prikaži sve termine
        </label>
      </div>
    </>
  );
}

export default Raspored;
