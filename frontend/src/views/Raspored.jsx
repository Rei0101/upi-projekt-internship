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
    "Nedjelja"
  ];
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const termini = useSelector((state) => state.user.termini.termini);
  console.log(termini)
  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, newTask.trim()]);
      setNewTask("");
    } else {
      window.alert("Molimo unesite zadatak prije dodavanja.");
    }
  };

  const handleDeleteTask = (indexToRemove) => {
    setTasks(tasks.filter((_, index) => index !== indexToRemove));
  };

  const mapTerminiToGrid = () => {
    if (!Array.isArray(termini) || termini.length === 0) {
      console.warn("Nema termina za prikaz.");
      return [];
    }

    const grid = [];

    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
      grid[dayIndex] = Array(5).fill(null); // Pretpostavka: 5 vremenskih slotova od 08:00 do 12:00

      for (const termin of termini) {
        if (termin.dan_u_tjednu.trim() === days[dayIndex].trim()) {
          const startHour = parseInt(termin.pocetak.split(":")[0], 10);
          const eventIndex = startHour - 8;

          if (eventIndex >= 0 && eventIndex < grid[dayIndex].length) {
            grid[dayIndex][eventIndex] = {
              kolegij_naziv: termin.kolegij_naziv,
              type: termin.kolegij_naziv.includes("Predavanja") ? "predavanje" : "vjezbe",
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

  const gridData = mapTerminiToGrid();

  return (
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
              {day.map((event, eventIndex) => (
                event !== null ? (
                  <div
                    key={`${dayIndex}-${eventIndex}`}
                    className={`grid-cell ${event.type === "predavanje" ? "yellow" : "red"}`}
                  >
                    {event.kolegij_naziv}
                  </div>
                ) : (
                  <div key={`${dayIndex}-${eventIndex}`} className="grid-cell">
                    {/* Empty cell if no event is scheduled */}
                  </div>
                )
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="tasks-container">
        <h2>Zadaci</h2>
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              {task}
              <button onClick={() => handleDeleteTask(index)}>Obriši</button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Dodajte novi zadatak"
        />
        <button onClick={handleAddTask}>Dodaj</button>
      </div>
    </div>
  );
}

export default Raspored;
