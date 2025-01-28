import pkg from "pg";
const { Pool } = pkg;

// za ovo ćemo zasad samo lokalnu bazu koristit
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ScheduleIT-DB",
  password: "internship",
  port: 5432,
});

export const queryDatabase = async (queryText, params = []) => {
  try {
    const res = await pool.query(queryText, params);
    return res.rows;
  } catch (error) {
    throw error;
  }
};

// ovo samo služi za uredno gašenje baze kad smo gotovi sa njom
const shutdown = async () => {
  try {
    await pool.end(); // Close the pool gracefully
    console.log("PostgreSQL pool closed.");
  } catch (error) {
    console.error("Error while closing PostgreSQL pool:", error);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
