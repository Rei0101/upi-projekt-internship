import { useState } from "react";
import "../css/raspored.css";
import { useSelector } from "react-redux";
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
  const sviTermini = useSelector((state) => state.user.sviTermini.grupe);
  const notes = useSelector((state) => state.user.notes.note[0].todo_zapis);
  const email = useSelector((state) => state.user.email);
  const kolokviji = useSelector((state) => state.user.kolokviji.colloquiums)
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleClosePopup = () => {
    setSelectedEvent(null);
  };


  const [text, setText] = useState(notes || "");

  const [showAll, setShowAll] = useState(false);


  const handleSave = async () => {
    try {
      await axios.put("http://localhost:3000/api/korisnik/novi-todo", {
        email: email,
        noviZapis: text,
      });
      console.log("Zabilješka uspješno spremljena!");




    } catch (error) {
      console.error("Greška prilikom slanja zahtjeva:", error);
    }
    console.log(notes)
  };


  const mapTerminiToGrid = (terminiData) => {
    if (!Array.isArray(terminiData) || terminiData.length === 0) {
      console.warn("Nema termina za prikaz.");
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
          } else {
            console.warn(`Termin izvan raspona: ${termin}`);
          }
        }
      }
    }
    return grid;
  };


  const gridData = mapTerminiToGrid(showAll ? sviTermini : termini);

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
          <div
            className="popup-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <h3>{selectedEvent.naziv_kolegija}</h3>
            <p><strong>Grupa:</strong> {selectedEvent.naziv_grupe}</p>
            <p><strong>Datum:</strong> {new Date(selectedEvent.datum).toLocaleDateString("hr-HR")}</p>
            <p><strong>Dan u tjednu:</strong> {selectedEvent.dan_u_tjednu}</p>
            <p><strong>Vrijeme:</strong> {selectedEvent.pocetak} - {selectedEvent.kraj}</p>
            <p><strong>Profesor:</strong> {selectedEvent.profesor_ime}</p>
            <p><strong>Prostorija:</strong> {selectedEvent.naziv_prostorije}</p>
            <button onClick={handleClosePopup}>Zatvori</button>
          </div>
        </div>
      )}
    </div>

      <div className="main-container">
        {/* Lijevi dio: Raspored */}
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
                    >
                      {event.kolegij_naziv}
                    </div>
                  ) : (
                    <div key={`${dayIndex}-${eventIndex}`} className="grid-cell">
                      {/* Prazan slot */}
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Desni dio: Textarea za bilješke */}
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

      {/* Checkbox za prikaz svih termina ili samo nekih */}
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
