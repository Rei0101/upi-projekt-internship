import React, { useState } from "react";
import "../css/raspored.css";

function Raspored() {
  const days = ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"];
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, newTask.trim()]);
      setNewTask("");
    }
  };

  const handleDeleteTask = (indexToRemove) => {
    setTasks(tasks.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="main-container">
      <div className="schedule-container">
        <div className="schedule-grid">
          {days.map((day) => (
            <div key={day} className="day-header">
              {day}
            </div>
          ))}
          {days.map((_, dayIndex) =>
            [...Array(5)].map((_, eventIndex) => (
              <div key={`${dayIndex}-${eventIndex}`} className="grid-cell">
                Događaj {eventIndex + 1}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="side-container">
        <div className="upcoming-events">
          <h2>Nadolazeći događaji</h2>
          <ul>
            <li>Događaj 1 - Datum</li>
            <li>Događaj 2 - Datum</li>
            <li>Događaj 3 - Datum</li>
          </ul>
        </div>
        <div className="todo-list">
          <h2>To-Do Lista</h2>
          <ul>
            {tasks.map((task, index) => (
              <li key={index} className="task-item">
                <span>{task}</span>
                <button
                  onClick={() => handleDeleteTask(index)}
                  className="delete-task-button"
                >
                  -
                </button>
              </li>
            ))}
          </ul>
          <div className="add-task-container">
            <input
              type="text"
              placeholder="Novi zadatak"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="task-input"
            />
            <button onClick={handleAddTask} className="add-task-button">
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Raspored;
