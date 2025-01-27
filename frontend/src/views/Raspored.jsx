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

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleGridEventClick = (termin) => {
    if (showAll && termin) {
      setSelectedTermin(termin);
    }
  };

  const handleClosePopup = () => {
    setSelectedEvent(null);
    setSelectedTermin(null);
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
    const staritermin = termini.find((stari) => stari.kolegij_id == kolegij_id)
    const stara_grupa_id = staritermin.grupa_naziv
    const nova_grupa_id = grupa_naziv
    
    const student_email = email
    console.log(student_email, kolegij_id, stara_grupa_id, nova_grupa_id)
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
                            (t) => t.kolegij_naziv === event.kolegij_naziv &&
                            t.dan_u_tjednu === days[dayIndex]
                
                          )
                          
                        )
                      }
                    >
                      {event.kolegij_naziv}
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
