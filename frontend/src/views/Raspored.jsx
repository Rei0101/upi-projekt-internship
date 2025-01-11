import { useState, useEffect } from "react";
import "../css/raspored.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchTermini } from "../redux/terminActions";

function Raspored() {
  const days = ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"];
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const dispatch = useDispatch();
  const email = "ivan.ivic@univ.com";
  const termini = useSelector((state) => state.termin.termini);

  useEffect(() => {
    if (email) {
      dispatch(fetchTermini(email));
    }
  }, [email, dispatch]);

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
      return [];
    }

    const grid = [];
    
    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
      grid[dayIndex] = Array(5).fill(null);
      for (const termin of termini) {
        if (termin.dan_u_tjednu === days[dayIndex]) {
          const eventIndex = parseInt(termin.pocetak.split(":")[0]) - 8;
          if (eventIndex >= 0 && eventIndex < 5) {
            grid[dayIndex][eventIndex] = {
              kolegij_naziv: termin.kolegij_naziv,
              type: termin.kolegij_naziv.includes("Predavanja") ? "predavanje" : "vjezbe",
            };
          }
        }
      }
    }
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
      {/* ... (existing code for side container with tasks) */}
    </div>
  );
}

export default Raspored;