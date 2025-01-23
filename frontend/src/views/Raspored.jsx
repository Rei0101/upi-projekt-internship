import { useState } from "react";
import "../css/raspored.css";
import { useSelector } from "react-redux";

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
  const [text, setText] = useState("");
  const [showAll, setShowAll] = useState(false); // Stanje za checkbox
  const termini = useSelector((state) => state.user.termini.termini);
  const svitermini = useSelector((state) => state.user.svitermini.grupe);

  const mapTerminiToGrid = (terminiData) => {
    if (!Array.isArray(terminiData) || terminiData.length === 0) {
      console.warn("Nema termina za prikaz.");
      return [];
    }

    const grid = [];

    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
      grid[dayIndex] = Array(5).fill(null); // Pretpostavka: 5 vremenskih slotova od 08:00 do 12:00

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

    console.log("Generated grid:", grid); // Debugging grid
    return grid;
  };

  const gridData = mapTerminiToGrid(showAll ? svitermini : termini); // Ovisno o stanju checkboxa

  return (
    <>
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
                    >
                      {event.kolegij_naziv}
                    </div>
                  ) : (
                    <div
                      key={`${dayIndex}-${eventIndex}`}
                      className="grid-cell"
                    >
                      {/* Empty cell if no event is scheduled */}
                    </div>
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
            <button>Spremi</button>
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
